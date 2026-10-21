import {
  ArrowDownRight,
  ArrowUpRight,
  FileImage,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Pin,
  Search,
  Wallet,
} from "lucide-react";

export type TutorialScreen = "dashboard" | "assets" | "memos" | "files";

const screenLabels: Record<TutorialScreen, string> = {
  dashboard: "ダッシュボード",
  assets: "資産管理",
  memos: "メモ",
  files: "ファイル管理",
};

function ScreenHeader({ screen }: { screen: TutorialScreen }) {
  const Icon = {
    dashboard: LayoutDashboard,
    assets: Wallet,
    memos: FileText,
    files: FolderOpen,
  }[screen];

  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 sm:text-xs">
        <span className="grid size-6 place-items-center rounded-md bg-brand-50 text-brand-600">
          <Icon size={13} />
        </span>
        {screenLabels[screen]}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] text-slate-400 sm:text-[10px]">今日の記録</span>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-5">
        {[
          { label: "総資産", value: "¥24,860,000", accent: "text-slate-900" },
          { label: "前月比", value: "+4.8%", accent: "text-emerald-600" },
          { label: "記録", value: "今月 12 件", accent: "text-slate-900" },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-slate-100 bg-white p-2 sm:rounded-lg sm:p-3">
            <p className="text-[8px] text-slate-400 sm:text-[10px]">{item.label}</p>
            <p className={`mt-1 truncate text-[10px] font-semibold sm:text-sm ${item.accent}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 rounded-md border border-slate-100 bg-white p-3 sm:mx-5 sm:mb-5 sm:rounded-lg sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-slate-700 sm:text-xs">資産の推移</p>
            <p className="mt-1 text-[8px] text-slate-400 sm:text-[10px]">過去 6 か月</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-medium text-emerald-700 sm:text-[10px]">
            <ArrowUpRight size={10} /> 12.6%
          </span>
        </div>
        <div className="mt-3 flex h-20 items-end gap-1.5 border-b border-slate-100 sm:h-28 sm:gap-2">
          {[34, 46, 41, 57, 62, 55, 72, 68, 88, 82, 100, 94].map((height, index) => (
            <div key={index} className="flex-1 rounded-t-sm bg-brand-100" style={{ height: `${height}%` }}>
              <div className="h-1/2 rounded-t-sm bg-brand-500/70" />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[7px] text-slate-400 sm:text-[9px]">
          <span>5月</span><span>6月</span><span>7月</span><span>8月</span><span>9月</span><span>10月</span>
        </div>
      </div>
    </>
  );
}

function AssetsPreview() {
  const assets = [
    { name: "普通預金", detail: "みずほ銀行", amount: "¥12,400,000", share: 72, color: "bg-brand-500" },
    { name: "投資信託", detail: "全世界株式", amount: "¥8,250,000", share: 54, color: "bg-emerald-500" },
    { name: "個人年金", detail: "積立プラン", amount: "¥2,900,000", share: 32, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-2 p-3 sm:space-y-3 sm:p-5">
      <div className="flex items-center justify-between rounded-md bg-brand-950 p-3 text-white sm:rounded-lg sm:p-4">
        <div>
          <p className="text-[8px] text-white/65 sm:text-[10px]">登録している資産</p>
          <p className="mt-1 text-base font-semibold sm:text-xl">¥23,550,000</p>
        </div>
        <div className="grid size-8 place-items-center rounded-full bg-white/10 sm:size-10">
          <Wallet size={16} />
        </div>
      </div>
      {assets.map((asset) => (
        <div key={asset.name} className="rounded-md border border-slate-100 bg-white p-2.5 sm:rounded-lg sm:p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-slate-700 sm:text-xs">{asset.name}</p>
              <p className="mt-0.5 truncate text-[8px] text-slate-400 sm:text-[10px]">{asset.detail}</p>
            </div>
            <p className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-800 sm:text-xs">{asset.amount}</p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${asset.color}`} style={{ width: `${asset.share}%` }} />
          </div>
        </div>
      ))}
      <p className="flex items-center gap-1 text-[8px] text-slate-400 sm:text-[10px]">
        <ArrowDownRight size={11} /> 記録を追加すると推移を振り返れます
      </p>
    </div>
  );
}

function MemosPreview() {
  return (
    <div className="grid min-h-[250px] grid-cols-[0.85fr_1.15fr] sm:min-h-[330px]">
      <div className="border-r border-slate-100 bg-slate-50/70 p-2.5 sm:p-4">
        <div className="mb-2 flex items-center justify-between text-[9px] font-semibold text-slate-700 sm:mb-3 sm:text-[11px]">
          <span>メモ</span><Search size={11} className="text-slate-400" />
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="rounded-md border border-brand-100 bg-white p-2 sm:rounded-lg sm:p-2.5">
            <p className="flex items-center gap-1 text-[8px] font-semibold text-slate-700 sm:text-[10px]"><Pin size={9} className="text-amber-500" />旅行の準備</p>
            <p className="mt-1 line-clamp-2 text-[7px] leading-relaxed text-slate-400 sm:text-[9px]">行きたい場所と持ち物をまとめる</p>
          </div>
          <div className="rounded-md border border-transparent bg-white/70 p-2 sm:rounded-lg sm:p-2.5">
            <p className="text-[8px] font-medium text-slate-600 sm:text-[10px]">読みたい本</p>
            <p className="mt-1 line-clamp-2 text-[7px] leading-relaxed text-slate-400 sm:text-[9px]">次の休日に本屋へ</p>
          </div>
          <div className="rounded-md border border-transparent bg-white/70 p-2 sm:rounded-lg sm:p-2.5">
            <p className="text-[8px] font-medium text-slate-600 sm:text-[10px]">家電の比較</p>
            <p className="mt-1 line-clamp-2 text-[7px] leading-relaxed text-slate-400 sm:text-[9px]">候補を見比べる</p>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-amber-50 px-1.5 py-1 text-[7px] font-medium text-amber-700 sm:px-2 sm:text-[9px]">ピン留め</span>
            <h3 className="mt-2 text-[11px] font-semibold text-slate-800 sm:mt-3 sm:text-sm">旅行の準備</h3>
          </div>
          <span className="text-[7px] text-slate-400 sm:text-[9px]">10月18日 更新</span>
        </div>
        <div className="mt-3 space-y-2 text-[8px] leading-relaxed text-slate-500 sm:mt-4 sm:space-y-3 sm:text-[10px]">
          <p>週末の旅行に向けて、行きたい場所や持ち物をひとまとめに。</p>
          <div className="rounded-md bg-emerald-50/80 p-2.5 text-emerald-900 sm:rounded-lg sm:p-3">
            <p className="font-semibold">行きたい場所</p>
            <p className="mt-1">・海辺のカフェ<br />・美術館の企画展<br />・駅前のマーケット</p>
          </div>
          <p className="text-slate-400">思いついたときに書いて、あとから検索。</p>
        </div>
      </div>
    </div>
  );
}

function FilesPreview() {
  return (
    <div className="p-3 sm:p-5">
      <div className="rounded-md border border-dashed border-brand-200 bg-brand-50/50 px-3 py-4 text-center sm:rounded-lg sm:px-4 sm:py-6">
        <span className="mx-auto grid size-8 place-items-center rounded-full bg-white text-brand-600 shadow-sm sm:size-10">
          <FolderOpen size={16} />
        </span>
        <p className="mt-2 text-[9px] font-semibold text-slate-700 sm:text-[11px]">ファイルをここにドロップ</p>
        <p className="mt-1 text-[7px] text-slate-400 sm:text-[9px]">またはクリックして選択</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-[9px] font-semibold text-slate-700 sm:mt-4 sm:text-[11px]">
        <span>最近追加したファイル</span><span className="font-normal text-slate-400">3 件</span>
      </div>
      <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
        {[
          { name: "家計の記録.pdf", meta: "PDF · 1.8 MB · 今日", Icon: FileText, color: "text-rose-500 bg-rose-50" },
          { name: "旅行の写真.jpg", meta: "画像 · 3.2 MB · 昨日", Icon: FileImage, color: "text-emerald-600 bg-emerald-50" },
          { name: "契約書控え.pdf", meta: "PDF · 860 KB · 10月16日", Icon: FileText, color: "text-rose-500 bg-rose-50" },
        ].map(({ name, meta, Icon, color }) => (
          <div key={name} className="flex items-center gap-2 rounded-md border border-slate-100 bg-white p-2 sm:gap-3 sm:rounded-lg sm:p-2.5">
            <span className={`grid size-7 shrink-0 place-items-center rounded-md sm:size-8 ${color}`}><Icon size={14} /></span>
            <div className="min-w-0">
              <p className="truncate text-[8px] font-medium text-slate-700 sm:text-[10px]">{name}</p>
              <p className="mt-0.5 text-[7px] text-slate-400 sm:text-[9px]">{meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TutorialScreenPreview({ screen }: { screen: TutorialScreen }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.42)] sm:rounded-xl">
      <div className="flex h-7 items-center gap-1.5 border-b border-slate-100 bg-white px-3 sm:h-8">
        <span className="size-1.5 rounded-full bg-rose-300 sm:size-2" />
        <span className="size-1.5 rounded-full bg-amber-300 sm:size-2" />
        <span className="size-1.5 rounded-full bg-emerald-300 sm:size-2" />
        <div className="mx-auto w-1/2 rounded-sm bg-slate-50 px-2 py-0.5 text-center text-[7px] text-slate-400 sm:rounded-md sm:text-[8px]">lifehub.app/{screen}</div>
      </div>
      <ScreenHeader screen={screen} />
      {screen === "dashboard" && <DashboardPreview />}
      {screen === "assets" && <AssetsPreview />}
      {screen === "memos" && <MemosPreview />}
      {screen === "files" && <FilesPreview />}
    </div>
  );
}