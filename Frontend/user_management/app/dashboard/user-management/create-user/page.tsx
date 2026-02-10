'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAllRoles } from '@/lib/api';

const API_BASE = 'http://localhost:3001/api'; // Change to your backend URL

interface Role {
  id: number;
  name: string;
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

 

  useEffect(() => {
    getAllRoles().then(data => setRoles(data))
      .catch(() => toast.error('Failed to load roles'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, roleId: value }));
  };

 
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const isPasswordValid = formData.password.length >= 8 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async () => {
    if (!formData.username || !formData.roleId || !isPasswordValid) {
      toast.error('Please fill required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || formData.username,
          username: formData.username,
          password: formData.password,
          roleId: Number(formData.roleId),
          isActive: formData.isActive,
        }),
      });

      if (res.ok) {
        // Reset form or redirect
        toast.success('User Created', { description: `${formData.username} has been added.` });
      } else {
        const err = await res.json();
        toast.error('Error', { description: err.message });
      }
    } catch {
      toast.error('Network Error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb / Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Create User</h1>
            <p className="text-sm text-muted-foreground">
              Users List / Create
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language, theme, profile icons */}
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="from-primary/5 to-primary/10 border-b px-6 py-5">
            <CardTitle className="text-xl">User Information</CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, isActive: !!checked }))
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User account is active or deactivate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label htmlFor="isActive" className="cursor-pointer text-sm font-medium">
                Is Active?
              </Label>
            </div>

            <Separator />

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username *
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name (optional)"
                  className="h-11"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      getPasswordStrength() === 0 && 'w-0 bg-red-500',
                      getPasswordStrength() === 1 && 'w-1/4 bg-orange-500',
                      getPasswordStrength() === 2 && 'w-2/4 bg-yellow-500',
                      getPasswordStrength() === 3 && 'w-3/4 bg-blue-500',
                      getPasswordStrength() === 4 && 'w-full bg-green-500'
                    )}
                  />
                </div>
                
              </div>
            </div>


            {/* Roles */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Roles <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.roleId} onValueChange={handleRoleChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.username || !formData.roleId || !isPasswordValid}
                className="min-w-[140px]"
              >
                {loading ? 'Creating...' : 'Create User'}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}