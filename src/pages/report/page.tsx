// 作成済み報告書一覧を確認できるページ
// 表示のみで、基本的にビジネスロジックは持たせない。

// 機能としては
// ページ読み込み時に対象ユーザーに紐づけられた報告書を一覧で表示し、詳細を見たいレポートはクリックでSPAのように表示切替。
// 対象のレポート情報の取得はクリック時にAPIを叩いて取得。

// ロード時はローディングアニメーションを利用
{/* <Card className="p-6">
<div className="flex flex-col items-center justify-center">
  <video autoPlay loop muted className="w-16 h-16">
    <source src="/loading.webm" type="video/webm" />
  </video>
  <p className="mt-4 text-gray-500">読み込み中...</p>
</div>
</Card> */}