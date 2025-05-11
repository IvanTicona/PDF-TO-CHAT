import React, { useState } from 'react';
import { ask } from '../services/api';

interface Props { documentId: string; }
type Msg = { role:'user'|'bot'; text:string; };

export default function Chat({ documentId }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const send = async () => {
    if (!q) return;
    setMsgs(m=>[...m,{role:'user',text:q}]);
    const { data } = await ask(documentId, q);
    setMsgs(m=>[...m,{role:'bot',text:data.answer}]);
    setQ('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-64 overflow-auto">
        {msgs.map((m,i)=>(
          <p key={i} className={m.role==='user'?'text-right':'text-left'}>
            <span className={m.role==='user'?'bg-blue-100':'bg-gray-100'} 
                  style={{ padding:'0.5rem', borderRadius:'0.5rem' }}>
              {m.text}
            </span>
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-grow border rounded p-2"
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Escribe tu pregunta…"
        />
        <button
          onClick={send}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
