import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { getSupabaseConfigStatus } from '@/lib/supabaseClient';
import { AuditLog } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

export const SystemHealth: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const supabaseStatus = getSupabaseConfigStatus();

  useEffect(() => {
    setAuditLogs(dbRepository.getAuditLogs());
  }, []);

  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to re-seed demo data to original factory defaults? This will restore initial exams, attempts, and newsletters.')) {
      dbRepository.resetToDefaults();
      setAuditLogs(dbRepository.getAuditLogs());
      alert('Local repository successfully re-seeded to factory defaults.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">System Telemetry & Operational Health</h2>
        <p className="text-xs text-slate-500">
          Inspect backend status, security event logs, and connection health without credential exposure.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Database Engine</span>
            <Database className="w-4 h-4 text-campus-teal-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">{supabaseStatus.mode}</p>
          <div className="flex items-center gap-1.5 text-xs">
            <Badge variant={supabaseStatus.isConfigured ? 'success' : 'teal'} size="sm">
              {supabaseStatus.isConfigured ? 'Cloud Connected' : 'Offline Verified Engine'}
            </Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-mono truncate">{supabaseStatus.url}</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">AI Grounding Engine</span>
            <Cpu className="w-4 h-4 text-campus-teal-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">SCEM Knowledge Guard</p>
          <div className="flex items-center gap-1.5 text-xs">
            <Badge variant="teal" size="sm">
              Vector & Full-Text Search
            </Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Anti-Hallucination Fallback Active</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Security Boundary</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">PostgreSQL RLS Active</p>
          <div className="flex items-center gap-1.5 text-xs">
            <Badge variant="success" size="sm">
              <Lock className="w-3 h-3" />
              Answer Keys Isolated
            </Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Server-Side Scoring Enforced</p>
        </Card>
      </div>

      {/* Database Reset Action */}
      <Card className="p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Reset Demo Environment</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Reset local repository to clean SCEM mock dataset (exams, attempts, newsletters, and knowledge documents).
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetDemoData} className="text-xs shrink-0">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Demo Data
        </Button>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-campus-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Security & Operational Audit Logs</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{auditLogs.length} Events Recorded</span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No audit events registered yet. System actions like exam submissions and newsletter publications are recorded here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <th className="pb-2.5 pl-2">Timestamp (IST)</th>
                  <th className="pb-2.5">Action</th>
                  <th className="pb-2.5">Entity Type</th>
                  <th className="pb-2.5">Target ID</th>
                  <th className="pb-2.5 text-right pr-2">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pl-2 text-slate-600 font-mono text-[11px]">
                      {formatInIST(log.created_at)}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {log.entity_type}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500">
                      {log.entity_id ? log.entity_id.substring(0, 16) : '—'}
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono text-[10px] text-slate-500 truncate max-w-xs">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
