import JavaExecutor from '../containers/javaExecutor';
import PythonExecutor from '../containers/pythonExecutor';
import CppExecutor from '../containers/cppExecutor';
import JavaScriptExecutor from '../containers/javaScriptExecutor';
import {CodeExecutorStrategy} from '../types/CodeExecutorStrategy';

export default function createExecutor(
  codeLanguage: string,
): CodeExecutorStrategy | null {
  if (codeLanguage.toLowerCase() === 'python') {
    return new PythonExecutor();
  } else if (codeLanguage.toLowerCase() === 'java') {
    return new JavaExecutor();
  } else if (codeLanguage.toLowerCase() === 'cpp') {
    return new CppExecutor();
  } else if(codeLanguage.toLowerCase() === 'javascript'){
    return new JavaScriptExecutor();
  } else {
    return null;
  }
}
