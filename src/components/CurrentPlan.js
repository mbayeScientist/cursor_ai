export default function CurrentPlan({ apiKeys }) {
  const totalUsage = apiKeys.reduce((acc, key) => acc + key.usage, 0);
  const usagePercentage = (totalUsage / 1000) * 100;

  return (
    <div className="rounded-xl p-8 bg-gradient-to-r from-rose-100 via-purple-200 to-blue-200 dark:from-rose-900/30 dark:via-purple-900/30 dark:to-blue-900/30">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-sm font-medium mb-2">CURRENT PLAN</div>
          <h2 className="text-4xl font-bold mb-4">Researcher</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">API Usage</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="w-full h-2 bg-black/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <div className="text-sm mt-2">{totalUsage} / 1000 Credits</div>
        </div>
        <button className="flex items-center gap-2 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Manage Plan
        </button>
      </div>
    </div>
  );
} 