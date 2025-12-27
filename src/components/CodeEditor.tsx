import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'javascript':
      return javascript({ jsx: true, typescript: true });
    case 'python':
      return python();
    case 'java':
      return java();
    case 'cpp':
    case 'c':
      return cpp();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'sql':
      return sql();
    default:
      return javascript();
  }
};

export function CodeEditor({ value, onChange, language, readOnly = false, height = '300px' }: CodeEditorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card">
      <CodeMirror
        value={value}
        height={height}
        theme={vscodeDark}
        extensions={[getLanguageExtension(language)]}
        onChange={onChange}
        readOnly={readOnly}
        className="font-mono text-sm"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
        }}
      />
    </div>
  );
}
