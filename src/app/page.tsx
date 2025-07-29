import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Chrono Wiki Front
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>イベント</CardTitle>
                <CardDescription>
                  歴史的な出来事を記録・管理します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">イベントを見る</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>人物</CardTitle>
                <CardDescription>
                  歴史上の人物の情報を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  人物を見る
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>タイムライン</CardTitle>
                <CardDescription>
                  時系列でイベントを表示します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">タイムラインを見る</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">shadcn/ui テスト</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Primary Badge
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  Secondary Badge
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Accent Badge
                </span>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="テキストを入力..."
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button>送信</Button>
              </div>

              <div className="flex gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
