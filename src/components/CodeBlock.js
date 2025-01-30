'use client'
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative my-4">
      <div className="bg-gray-900 rounded-t-lg p-2 flex items-center justify-between">
        <span className="text-gray-400 text-sm">{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span className="text-sm">Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-800 p-4 rounded-b-lg overflow-x-auto">
        <code className="text-gray-100 text-sm font-mono whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;