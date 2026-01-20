import React, { useState } from 'react';
import { ZodError } from 'zod';

import LinkOutlined from '@mui/icons-material/LinkOutlined';
import { Button } from '@mui/material';
import { TextProps, TextPropsDefaults, TextPropsSchema } from '@usewaypoint/block-text';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import TextInput from './helpers/inputs/TextInput';
import InsertLinkDialog from './helpers/InsertLinkDialog';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type TextSidebarPanelProps = {
  data: TextProps;
  setData: (v: TextProps) => void;
};
export default function TextSidebarPanel({ data, setData }: TextSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const updateData = (d: unknown) => {
    const res = TextPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const handleInsertLink = (markdownLink: string) => {
    const currentText = data.props?.text ?? '';
    const newText = currentText ? `${currentText} ${markdownLink}` : markdownLink;
    updateData({ ...data, props: { ...data.props, text: newText } });
  };

  return (
    <BaseSidebarPanel title="Text block">
      <TextInput
        label="Content"
        rows={5}
        value={data.props?.text ?? ''}
        onChange={(text) => updateData({ ...data, props: { ...data.props, text } })}
      />
      <Button
        variant="text"
        size="small"
        startIcon={<LinkOutlined />}
        onClick={() => setLinkDialogOpen(true)}
        sx={{ mb: 1 }}
      >
        Insert Link
      </Button>
      <BooleanInput
        label="Markdown (GitHub flavored)"
        defaultValue={data.props?.markdown ?? TextPropsDefaults.markdown}
        onChange={(markdown) => updateData({ ...data, props: { ...data.props, markdown } })}
      />

      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />

      {linkDialogOpen && (
        <InsertLinkDialog onClose={() => setLinkDialogOpen(false)} onInsert={handleInsertLink} />
      )}
    </BaseSidebarPanel>
  );
}
