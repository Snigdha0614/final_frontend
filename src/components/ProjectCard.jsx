import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, Repeat, ArrowRight, Briefcase } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const isSkillExchange = project.budgetType === 'SKILL_EXCHANGE';
  const skills = project.requiredSkills ? project.requiredSkills.split(',').map((s) => s.trim()) : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
              {project.category}
            </span>
            {isSkillExchange ? (
              <span className="text-[11px] font-bold bg-purple-100 text-purple-900 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-purple-200/60">
                <Repeat className="w-3 h-3 text-purple-700" /> Skill Barter
              </span>
            ) : (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200/60">
                <DollarSign className="w-3 h-3 text-emerald-700" /> {project.budgetType?.replace('_', ' ')}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
              project.status === 'OPEN'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Project Title */}
        <Link to={`/projects/${project.id}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-2">
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium self-center">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
            {isSkillExchange ? 'Compensation' : 'Budget'}
          </span>
          <span className="text-sm font-extrabold text-slate-900">
            {isSkillExchange
              ? 'Skill Barter / Trade'
              : project.fixedBudget
              ? `$${Number(project.fixedBudget).toFixed(2)}`
              : project.budgetMin && project.budgetMax
              ? `$${project.budgetMin} - $${project.budgetMax}`
              : 'Negotiable'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {project.proposalCount || 0} Proposals
            </span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
