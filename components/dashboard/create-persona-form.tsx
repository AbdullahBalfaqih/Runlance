'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreatePersonaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonaFormData) => void;
}

export interface PersonaFormData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  targetRoles: string[];
}

export function CreatePersonaForm({ isOpen, onClose, onSubmit }: CreatePersonaFormProps) {
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    title: '',
    bio: '',
    skills: [],
    experienceYears: 0,
    targetRoles: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddRole = () => {
    if (roleInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        targetRoles: [...prev.targetRoles, roleInput.trim()],
      }));
      setRoleInput('');
    }
  };

  const handleRemoveRole = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      title: '',
      bio: '',
      skills: [],
      experienceYears: 0,
      targetRoles: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Persona</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Persona Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Senior Product Manager"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1"
              required
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-semibold">
              Target Job Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Director of Product"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1"
            />
          </div>

          {/* Experience Years */}
          <div>
            <Label htmlFor="experience" className="text-sm font-semibold">
              Years of Experience
            </Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="60"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experienceYears: parseInt(e.target.value) || 0,
                }))
              }
              className="mt-1"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-sm font-semibold">
              Bio / Summary
            </Label>
            <Textarea
              id="bio"
              placeholder="Describe your background and career aspirations..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="mt-1 min-h-20"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-semibold">Skills</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                className="bg-black text-white hover:bg-gray-900"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <Label className="text-sm font-semibold">Target Roles</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add a target role..."
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddRole}
                className="bg-black text-white hover:bg-gray-900"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.targetRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-900"
              disabled={!formData.name}
            >
              Create Persona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
