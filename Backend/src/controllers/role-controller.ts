import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { roleSchema } from '../schemas/role-schemas';


export const createRole = async (req: Request, res: Response) => {
  try {
    // 1) Validate request
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const { name, permissions } = parsed.data;

    // 2) Check duplicate role name
    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "Role name already exists" });
    }

    // 3) Transaction (role + permissions)
    const role = await prisma.$transaction(async (tx) => {
      // 3.1 Create role
      const role = await tx.role.create({
        data: { name },
      });

      // permissions မပါရင် role ပဲ return
      if (!permissions || Object.keys(permissions).length === 0) {
        return role;
      }

      // 3.2 Flatten permissions object
      const pairs: { feature: string; action: string }[] = [];

      for (const [feature, actions] of Object.entries(permissions)) {
        for (const action of actions) {
          pairs.push({
            feature: feature.trim(),
            action: action.trim(),
          });
        }
      }

      // 3.3 Find permission IDs
      const permissionRows = await tx.permission.findMany({
        where: {
          OR: pairs.map((p) => ({
            name: p.action,
            feature: { name: p.feature },
          })),
        },
        select: { id: true },
      });

      if (permissionRows.length === 0) {
        throw new Error("Permissions not found in database");
      }

      // 3.4 Insert into RolePermission join table
      await tx.rolePermission.createMany({
        data: permissionRows.map((p) => ({
          roleId: role.id,
          permissionId: p.id,
        })),
        skipDuplicates: true,
      });

      return role;
    });

    return res.status(201).json({
      message: "Role created successfully",
      role,
    });
  } catch (err: any) {
    console.error("createRole error:", err);

    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
};

export const getAllRoles = async (_req: Request, res: Response) => {
  const roles = await prisma.role.findMany({ orderBy: { name: 'asc' } });
  res.json(roles);
};

