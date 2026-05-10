'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import BorderGlow from '@/components/ui/border-glow';
import { Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonasPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModalData({ title, message });
    setIsModalOpen(true);
  };

  const [personas, setPersonas] = useState([
    {
      id: '1',
      name: 'Product Manager',
      title: 'Senior Product Manager',
      experience: '8 years',
      skills: ['Product Strategy', 'Data Analysis', 'Leadership'],
      isActive: true,
    },
    {
      id: '2',
      name: 'Engineering Lead',
      title: 'Engineering Manager',
      experience: '10 years',
      skills: ['System Design', 'Team Management', 'Full Stack'],
      isActive: false,
    },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Personas</h1>
            <p className="text-gray-400">Create and manage different career personas</p>
          </div>
          <button 
            onClick={() => showModal('Persona Creation', 'The persona builder is currently in development. You will soon be able to create custom AI-driven career profiles.')}
            className="button2 mt-4 md:mt-0 !py-3 px-8"
          >
            <Plus size={20} className="mr-2" />
            New Persona
          </button>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona) => (
            <BorderGlow
              key={persona.id}
              borderRadius={24}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                      {persona.isActive && (
                        <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Active</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 font-medium">{persona.title}</p>
                    <p className="text-gray-500 text-sm">{persona.experience} experience</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/5 text-rose-500/50 hover:text-rose-500 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-[0.2em]">Core Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {persona.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => showModal('Persona Profile', `Detailed metrics and optimization history for ${persona.name} will be available here.`)}
                    className="button2 flex-1 !py-3 !bg-transparent border border-white/20 hover:!bg-white/5 !text-white"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/resume')}
                    className="button2 flex-1 !py-3"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </BorderGlow>
          ))}

          {/* Add New Card */}
          <BorderGlow
            borderRadius={24}
            backgroundColor="#000000"
            glowColor="0 0 100"
            colors={['#ffffff', '#444444', '#111111']}
            animated
          >
            <div 
              onClick={() => showModal('New Persona', 'Start building a new career persona by defining your target role and expertise level.')}
              className="p-10 border-2 border-dashed border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center rounded-[inherit] hover:bg-white/5 h-full min-h-[250px]"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-white/30">
                <Plus size={24} className="text-gray-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Create New Persona</h3>
              <p className="text-gray-500 text-sm max-w-[180px]">Build a profile for a different role</p>
            </div>
          </BorderGlow>
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <BorderGlow
              borderRadius={32}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
            >
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">{modalData.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {modalData.message}
                </p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="button2 w-full !py-4"
                >
                  Understood
                </button>
              </div>
            </BorderGlow>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
