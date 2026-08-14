import React, { useState, useEffect, useCallback } from 'react';
import { Lock } from 'lucide-react';
import { initAuth, subscribeAgreements, loadAgreement, saveAgreement, deleteAgreement } from './firebase';
import { buildDefaultAgreement } from './defaults';
import Dashboard from './components/Dashboard';
import AgreementForm from './components/AgreementForm';
import AgreementPreview from './components/AgreementPreview';

const APP_PASSCODE = process.env.REACT_APP_APP_PASSCODE;

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState('dashboard');
  const [agreements, setAgreements] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [agreementData, setAgreementData] = useState(buildDefaultAgreement());
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || !isUnlocked) return undefined;
    const unsubscribe = subscribeAgreements(setAgreements, () => {});
    return unsubscribe;
  }, [user, isUnlocked]);

  useEffect(() => {
    document.title = view === 'dashboard' ? 'Spark Agreements | Dashboard' : `Agreement | ${agreementData.clientName || 'Untitled'}`;
  }, [view, agreementData.clientName]);

  const handleLogin = () => {
    if (APP_PASSCODE && passInput === APP_PASSCODE) {
      setIsUnlocked(true);
    }
  };

  const createNew = useCallback(() => {
    setCurrentId(null);
    setAgreementData(buildDefaultAgreement());
    setView('editor');
  }, []);

  const editAgreement = useCallback(async (id) => {
    const found = agreements.find((a) => a.id === id);
    if (found) {
      setAgreementData(found);
    } else {
      const loaded = await loadAgreement(id);
      if (loaded) setAgreementData(loaded);
    }
    setCurrentId(id);
    setView('editor');
  }, [agreements]);

  const previewAgreement = useCallback(async (id) => {
    await editAgreement(id);
    setView('preview');
  }, [editAgreement]);

  const duplicateAgreement = useCallback(async (id) => {
    const source = agreements.find((a) => a.id === id) || await loadAgreement(id);
    if (!source) return;
    const { id: _drop, createdAt, updatedAt, ...rest } = source;
    setAgreementData({ ...rest, clientName: `${rest.clientName || 'Client'} (Copy)`, status: 'draft' });
    setCurrentId(null);
    setView('editor');
  }, [agreements]);

  const deleteAgreementHandler = useCallback(async (id) => {
    setDeletingId(id);
    try {
      await deleteAgreement(id);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const savedId = await saveAgreement(currentId, agreementData);
      setCurrentId(savedId);
    } finally {
      setIsSaving(false);
    }
  }, [currentId, agreementData]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[2rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-sm">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-light mb-2 text-slate-950 uppercase">Spark Agreements</h2>
          <p className="text-slate-400 text-[10px] mb-8 tracking-[0.3em] uppercase font-black">Internal Studio Access</p>
          <input
            type="password"
            placeholder="KEY CODE"
            className="w-full p-4 border border-slate-200 bg-slate-50 rounded-2xl mb-6 text-center outline-none focus:ring-1 focus:ring-slate-300 font-black tracking-[0.4em]"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } }}
          />
          <button onClick={handleLogin} className="w-full bg-slate-950 text-white py-4 rounded-2xl font-bold hover:bg-[#C5A059] transition-all uppercase tracking-widest text-xs active:scale-95">
            Open Portal
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-300 text-sm">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'dashboard' && (
        <Dashboard
          agreements={agreements}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onNew={createNew}
          onEdit={editAgreement}
          onDuplicate={duplicateAgreement}
          onDelete={deleteAgreementHandler}
          onPreview={previewAgreement}
          deletingId={deletingId}
        />
      )}
      {view === 'editor' && (
        <AgreementForm
          data={agreementData}
          setData={setAgreementData}
          onSave={handleSave}
          onPreview={() => setView('preview')}
          onCancel={() => setView('dashboard')}
          isSaving={isSaving}
        />
      )}
      {view === 'preview' && (
        <AgreementPreview
          data={agreementData}
          onBack={() => setView('dashboard')}
          onEdit={() => setView('editor')}
        />
      )}
    </div>
  );
}
