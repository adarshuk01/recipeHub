
import { useState } from "react";

export const Tabs = ({ tabs, onCreate }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === tab.key
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-orange-500"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 text-center">
        {tabs.find((t) => t.key === activeTab)?.count === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Placeholder illustration */}
            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
              <span className="text-3xl">📄</span>
            </div>

            {/* Text */}
            <h2 className="text-lg font-semibold">
              Get started and create your first {activeTab}!
            </h2>
            <p className="text-gray-500 text-sm">
              You haven’t created any {activeTab}. Write your first one and see it here!
            </p>

            {/* Button */}
            <button
              onClick={onCreate}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Create {activeTab}
            </button>
          </div>
        ) : (
          <p className="text-gray-600">
            Showing {tabs.find((t) => t.key === activeTab)?.label} content here...
          </p>
        )}
      </div>
    </div>
  );
};

// Usage example
export default function RecipePage() {
  const tabs = [
    { key: "recipes", label: "Recipes", count: 0 },
    { key: "cooksnaps", label: "Cooksnaps", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Tabs
        tabs={tabs}
        onCreate={() => alert("Create button clicked!")}
      />
    </div>
  );
}

