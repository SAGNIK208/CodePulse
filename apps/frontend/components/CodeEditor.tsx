import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language }) => {
  const [code, setCode] = useState("// Write your code here");

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height="300px"
        defaultLanguage={language.toLowerCase()}
        value={code}
        onChange={(newCode) => setCode(newCode || "")}
        theme="light"
      />
    </div>
  );
};

export default CodeEditor;
