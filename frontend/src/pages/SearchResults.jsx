import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchData } from '../data/searchData';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const results = searchData.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.category.toLowerCase().includes(query)
  );

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-on-surface mb-2">Hasil Pencarian</h2>
      <p className="text-on-surface-variant mb-8 text-sm">
        Menampilkan hasil untuk: <span className="text-primary font-bold">"{query}"</span>
      </p>

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map(item => (
            <Link 
              key={item.id} 
              to={item.path} 
              className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:border-primary transition-all flex justify-between items-center group"
            >
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">
                  {item.category}
                </span>
                <h4 className="text-lg font-bold text-on-surface group-hover:text-primary">{item.title}</h4>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward_ios
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
          <p className="text-slate-400">Maaf, kami tidak menemukan hasil yang cocok.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;