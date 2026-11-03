import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { User, Shield, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, isDemoMode, role } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [usn, setUsn] = useState(user?.usn || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [semester, setSemester] = useState(user?.semester || 4);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({
        full_name: fullName,
        usn,
        department,
        semester: Number(semester),
      });
      setSuccessMsg('Academic profile updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Institutional Profile & Credentials" maxWidth="md">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Header Avatar & Role status */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="w-14 h-14 rounded-2xl bg-campus-navy-800 text-campus-teal-400 font-bold text-xl flex items-center justify-center shadow-inner">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              user.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{user.full_name}</h4>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={role === 'admin' ? 'primary' : 'teal'} size="sm">
                {role === 'admin' ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                {role === 'admin' ? 'Administrator' : 'Verified Student'}
              </Badge>
              {isDemoMode && (
                <span className="text-[10px] text-slate-400 font-mono bg-slate-200/70 px-1.5 py-0.5 rounded">
                  Demo Record
                </span>
              )}
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="USN / Faculty ID"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              placeholder="e.g. 4SF22CS014"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Science & Engineering">Information Science & Engineering</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Data Science & Engineering">Data Science & Engineering</option>
              <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Dean Academics & Examinations">Dean Academics & Examinations</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
            <strong>Role Security Policy:</strong> Role elevation to Administrator is enforced server-side through PostgreSQL RLS and cannot be modified by students. Contact the Exam Section for official administrative delegation.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" variant="accent" size="sm" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

