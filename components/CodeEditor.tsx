import React from 'react';

interface CodeEditorProps {
  language: string;
  code: string;
  setCode?: (code: string) => void;
  isReadOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = React.memo(({ language, code, setCode, isReadOnly = false, height = 'h-64' }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setCode) {
      setCode(event.target.value);
    }
  };

  return (
    <div className={`bg-primary-dark rounded-md border border-border-dark relative flex flex-col ${height}`}>
      <div className="bg-secondary-dark px-4 py-2 border-b border-border-dark rounded-t-md">
        <span className="text-xs font-semibold uppercase text-gray-400">{language}</span>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        readOnly={isReadOnly}
        className="flex-grow w-full p-3 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none"
        spellCheck="false"
      />
    </div>
  );
});

export default CodeEditor;