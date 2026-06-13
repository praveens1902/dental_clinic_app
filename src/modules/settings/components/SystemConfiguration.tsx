import React from 'react'
import { HardDrive, Server, ShieldCheck, Cpu } from 'lucide-react'
import { SystemConfig } from '../types'

interface SystemConfigurationProps {
  config: SystemConfig
}

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ config }) => {
  return (
    <div className="space-y-4 text-left select-none">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Sirona System Configuration
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Diagnostics, cloud server environments, backups, and storage allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* App version */}
        <div className="border border-border/80 rounded-xl p-4 bg-background/25 flex items-center gap-3">
          <div className="p-2.5 bg-white border border-border/80 rounded-xl text-primary shrink-0 shadow-sm">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[9px] text-text-secondary uppercase font-bold">App Version</span>
            <p className="text-xs font-black text-text-primary mt-0.5">{config.appVersion}</p>
          </div>
        </div>

        {/* Environment */}
        <div className="border border-border/80 rounded-xl p-4 bg-background/25 flex items-center gap-3">
          <div className="p-2.5 bg-white border border-border/80 rounded-xl text-primary shrink-0 shadow-sm">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[9px] text-text-secondary uppercase font-bold">Environment</span>
            <p className="text-xs font-black text-primary mt-0.5 uppercase tracking-wide">{config.environment}</p>
          </div>
        </div>

        {/* Backups */}
        <div className="border border-border/80 rounded-xl p-4 bg-background/25 flex items-center gap-3">
          <div className="p-2.5 bg-white border border-border/80 rounded-xl text-success shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-success animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-text-secondary uppercase font-bold">Database Backup</span>
            <p className="text-xs font-black text-success mt-0.5">{config.backupStatus}</p>
          </div>
        </div>

        {/* Storage progress */}
        <div className="border border-border/80 rounded-xl p-4 bg-background/25 flex flex-col justify-center space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold text-text-secondary uppercase leading-none">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-text-secondary" />
              <span>Storage Used</span>
            </span>
            <span>{config.storageUsedPct}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${config.storageUsedPct}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
export default SystemConfiguration
