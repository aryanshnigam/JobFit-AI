import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart2 } from 'lucide-react';

export function SkillGapChart({ matchedCount, partialCount, missingCount }) {
  const barData = [
    { name: 'Matched Skills', count: matchedCount, color: '#10b981' },
    { name: 'Partial Skills', count: partialCount, color: '#f59e0b' },
    { name: 'Missing Skills', count: missingCount, color: '#f43f5e' }
  ];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <BarChart2 size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Skill Gap Overview</h3>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-subtle)" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
