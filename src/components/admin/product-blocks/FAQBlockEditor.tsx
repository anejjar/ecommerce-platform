'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface FAQBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function FAQBlockEditor({ config, onUpdate }: FAQBlockEditorProps) {
  const questions = config.questions || [{ question: '', answer: '' }];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    handleChange('questions', newQuestions);
  };

  const addQuestion = () => {
    handleChange('questions', [...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      handleChange('questions', questions.filter((_: any, i: number) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="heading">Heading</Label>
        <Input
          id="heading"
          value={config.heading || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="Enter heading"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Questions</Label>
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>

        {questions.map((item: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Question {index + 1}</span>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Question"
                value={item.question || ''}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              />
              <Textarea
                placeholder="Answer"
                value={item.answer || ''}
                onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

