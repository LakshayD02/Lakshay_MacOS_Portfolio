"use client"

export default function AppStore() {
  return (
    <div className="h-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">App Store</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Discover apps and updates for your macOS Portfolio experience.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-2">Featured</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Browse the latest featured apps curated for your portfolio.</p>
          </div>
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-2">Updates</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Check for new updates to applications already installed.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700">
            <h3 className="font-semibold">Coming soon</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This demo App Store is a placeholder for future content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
