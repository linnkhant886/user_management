"use client";

import { useState } from "react";
import { ChevronLeft, Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// import { useToast } from '@/components/ui/use-toast';

const modules = [
  {
    name: "Supplier",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
  {
    name: "Customer",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
  {
    name: "Product",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
  {
    name: "Variation",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
  {
    name: "Purchase",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
  {
    name: "Sale",
    permissions: [
      "View",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Export",
      "Print",
    ],
  },
];

export default function CreateRolePage() {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handlePermissionToggle = (module: string, perm: string) => {
    setPermissions((prev) => {
      const current = prev[module] ?? []; 
  
      const next = current.includes(perm)
        ? current.filter((p) => p !== perm)
        : [...current, perm];
  
      const updated = { ...prev, [module]: next };
  
      // console.log("[toggle]", { module, perm, updated }); 
      return updated;
    });
  };

  const handleSelectAllForModule = (module: string, checked: boolean) => {
    const perms = modules.find((m) => m.name === module)?.permissions ?? [];

    setPermissions((prev) => {
      const updated = { ...prev, [module]: checked ? [...perms] : [] };
      // console.log("[select-all-module]", { module, checked, updated }); 
      return updated;
    });
  };

  const handleSelectAll = () => {
    setPermissions((prev) => {
      const isAllSelected = modules.every((m) => {
        const current = prev[m.name] ?? [];
        return current.length === m.permissions.length;
      });
  
      const updated = isAllSelected
        ? Object.fromEntries(modules.map((m) => [m.name, []]))
        : Object.fromEntries(modules.map((m) => [m.name, m.permissions]));
  
      // console.log("[select-all-toggle]", { isAllSelected, updated }); 
      return updated;
    });
  };

  const handleSave = () => {
    const payload = {
      roleName,
      isAdmin,
      permissions, // ✅ checked data အကုန် (module -> string[])
    };
  
    console.log("[SAVE payload]", payload);
  
    // TODO: backend call example
    // await fetch("/api/roles", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  
    toast.success("Role Created Successfully", {
      description: `${roleName} has been created with selected permissions.`,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-muted/40">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="flex h-16 items-center px-6 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Create Role</h1>
          </div>
        </div>

        <div className="container max-w-5xl py-8">
          {/* Role Name */}
          <div className="mb-8">
            <Label htmlFor="role-name" className="text-base font-medium">
              Role name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="mt-2 max-w-md text-lg font-medium"
              placeholder="Enter role name"
            />
          </div>

          {/* Permissions Card */}
          <Card className="overflow-hidden">
            <div className=" from-primary/5 to-primary/10 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Role Permissions</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure what this role can access and do in the system
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {modules.map((module) => {
                const modulePerms = permissions[module.name] || [];
                const allChecked =
                  modulePerms.length === module.permissions.length;

                return (
                  <div key={module.name} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        id={`select-all-${module.name}`}
                        checked={allChecked}
                        // indeterminate={someChecked}
                        onCheckedChange={(checked) =>
                          handleSelectAllForModule(
                            module.name,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={`select-all-${module.name}`}
                        className="text-base font-semibold cursor-pointer flex-1"
                      >
                        {module.name}
                      </Label>
                    </div>


                    {/* permission check */}
                    <div className="ml-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                      {module.permissions.map((perm) => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${module.name}-${perm}`}
                            checked={modulePerms.some((p) => p === perm)}
                            onCheckedChange={() =>
                              handlePermissionToggle(module.name, perm)
                            }
                          />
                          <Label
                            htmlFor={`${module.name}-${perm}`}
                            className={cn(
                              "cursor-pointer text-sm font-medium",
                              modulePerms.some((p) => p === perm) &&
                                "text-primary font-semibold",
                            )}
                          >
                            {perm}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <Separator />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button size="lg" className="px-8" onClick={handleSave}>
              <Save className="h-5 w-5 mr-2" />
              Save Role
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
