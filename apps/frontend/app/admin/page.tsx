"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useForm, useFieldArray } from 'react-hook-form';
import Layout from '../../components/Layout';

const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problems" }
];
  

// Mock data and types
const languages = ["JavaScript", "Java", "C++", "Python"] as const;
type Language = (typeof languages)[number];
type Difficulty = "Easy" | "Medium" | "Hard";

const difficulties: Difficulty[]= ["Easy", "Medium", "Hard"];

interface CodeTemplate {
    language: Language;
    startSnippet: string;
    userCodeSnippet: string;
    endSnippet: string;
}

interface ProblemFormData {
    title: string;
    description: string;
    editorial?: string;
    difficulty: Difficulty;
    codeTemplates: CodeTemplate[];
}

const AdminAddProblemPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState: { errors }, control } = useForm<ProblemFormData>({
        defaultValues: {
            title: '',
            description: '',
            editorial: '',
            difficulty: "Easy",
            codeTemplates: [{ language: "JavaScript", startSnippet: '', userCodeSnippet: '', endSnippet: '' }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "codeTemplates",
    });
    const [descriptionPreview, setDescriptionPreview] = useState("");
    const [editorialPreview, setEditorialPreview] = useState("");

    const onSubmit = async (data: ProblemFormData) => {
        setLoading(true);
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        router.push('/admin/problems');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescriptionPreview(value);
    };

    const handleEditorialChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setEditorialPreview(value);
    };

    return (
      <Layout links={links}>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 p-4 md:p-6 lg:p-8 pt-20"> {/* Added pt-20 */}
            <div className="flex items-center mb-6 md:mb-8">
                <button
                    onClick={() => router.back()}
                    className="mr-2 md:mr-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Add New Problem</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="space-y-6">
                    {/* Problem Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Problem Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title", { required: "Problem title is required" })}
                            placeholder="e.g. Two Sum"
                            className="w-full shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Difficulty Level
                        </label>
                        <select
                            id="difficulty"
                            {...register("difficulty", { required: "Difficulty level is required" })}
                            className="w-full shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                        >
                            <option value="">Select Difficulty</option>
                            {difficulties.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Problem Description
                        </label>
                        <textarea
                            id="description"
                            {...register("description", { required: "Problem description is required" })}
                            placeholder="Describe the problem, including examples and constraints..."
                            className="w-full min-h-[100px] shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                            onChange={handleDescriptionChange}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use markdown formatting for better readability.</p>
                    </div>

                    {/* Editorial */}
                    <div>
                        <label htmlFor="editorial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Editorial (Solution Explanation)
                        </label>
                        <textarea
                            id="editorial"
                            {...register("editorial")}
                            placeholder="Explain the solution approach..."
                            className="w-full min-h-[100px] shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                            onChange={handleEditorialChange}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional: Provide explanation of solution approaches.</p>
                    </div>

                    {/* Code Templates */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Code Templates
                        </label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</span>
                                    <div className='flex items-center gap-2'>
                                        <select
                                            {...register(`codeTemplates.${index}.language`, { required: "Language is required" })}
                                            className="shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100 w-[180px]"
                                        >
                                            <option value="">Select Language</option>
                                            {languages.map((lang) => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700 rounded-md p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                {errors.codeTemplates?.[index]?.language && (
                                    <p className="text-red-500 text-xs mt-1">{errors.codeTemplates[index].language.message}</p>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Start Snippet
                                    </label>
                                    <textarea
                                        {...register(`codeTemplates.${index}.startSnippet`, { required: "Start snippet is required" })}
                                        className="w-full mb-2 shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                                        placeholder="Enter the starting code snippet"
                                    />
                                    {errors.codeTemplates?.[index]?.startSnippet && (
                                        <p className="text-red-500 text-xs mt-1">{errors.codeTemplates[index].startSnippet.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        User Code Snippet
                                    </label>
                                    <textarea
                                        {...register(`codeTemplates.${index}.userCodeSnippet`, { required: "User code snippet is required" })}
                                        className="w-full shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                                        placeholder="Enter the user code snippet"
                                    />
                                    {errors.codeTemplates?.[index]?.userCodeSnippet && (
                                        <p className="text-red-500 text-xs mt-1">{errors.codeTemplates[index].userCodeSnippet.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        End Snippet
                                    </label>
                                    <textarea
                                        {...register(`codeTemplates.${index}.endSnippet`, { required: "End snippet is required" })}
                                        className="w-full mb-2 shadow-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-100"
                                        placeholder="Enter the ending code snippet"
                                    />
                                    {errors.codeTemplates?.[index]?.endSnippet && (
                                        <p className="text-red-500 text-xs mt-1">{errors.codeTemplates[index].endSnippet.message}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {fields.length === 0 && <p className="text-red-500 text-xs mt-1">At least one code template is required</p>}
                        <button
                            type="button"
                            onClick={() => append({ language: languages[0], startSnippet: '', userCodeSnippet: '', endSnippet: '' })}
                            className="mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            + Add Language
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Description Preview</h3>
                        <div className='border rounded-md prose dark:prose-invert bg-gray-100 dark:bg-gray-800 p-4'>
                            <ReactMarkdown>{descriptionPreview}</ReactMarkdown>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Editorial Preview</h3>
                        <div className='border rounded-md prose dark:prose-invert bg-gray-100 dark:bg-gray-800 p-4'>
                            <ReactMarkdown>{editorialPreview}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
      </Layout>
    );
};

export default AdminAddProblemPage;