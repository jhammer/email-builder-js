import React, { useRef, useState } from 'react';
import { ZodError } from 'zod';

import LinkOutlined from '@mui/icons-material/LinkOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { Button, Menu, MenuItem } from '@mui/material';
import { TextProps, /* TextPropsDefaults, */ TextPropsSchema } from '@usewaypoint/block-text';

const MAIL_MERGE_TAGS = [
  '[first name]',
  '[last name]',
  '[email address]',
  '[company name]',
  '[custom 1]',
  '[custom 2]',
  '[custom 3]',
  '[custom 4]',
  '[custom 5]',
  '[year]'
];

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
// import BooleanInput from './helpers/inputs/BooleanInput';
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
  const [mergeTagMenuAnchor, setMergeTagMenuAnchor] = useState<HTMLElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

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
    const cursorPos = cursorPositionRef.current;

    let newText: string;
    if (cursorPos !== null && cursorPos >= 0 && cursorPos <= currentText.length) {
      newText = currentText.slice(0, cursorPos) + markdownLink + currentText.slice(cursorPos);
    } else {
      newText = currentText ? `${currentText} ${markdownLink}` : markdownLink;
    }
    updateData({ ...data, props: { ...data.props, text: newText } });
  };

  const saveCursorPosition = () => {
    if (textInputRef.current) {
      cursorPositionRef.current = textInputRef.current.selectionStart;
    }
  };

  const handleInsertMergeTag = (tag: string) => {
    const currentText = data.props?.text ?? '';
    const cursorPos = cursorPositionRef.current;

    let newText: string;
    if (cursorPos !== null && cursorPos >= 0 && cursorPos <= currentText.length) {
      newText = currentText.slice(0, cursorPos) + tag + currentText.slice(cursorPos);
    } else {
      newText = currentText ? `${currentText}${tag}` : tag;
    }

    updateData({ ...data, props: { ...data.props, text: newText } });
    setMergeTagMenuAnchor(null);
  };

  return (
    <BaseSidebarPanel title="Text block">
      <TextInput
        label="Content"
        rows={5}
        value={data.props?.text ?? ''}
        onChange={(text) => updateData({ ...data, props: { ...data.props, text } })}
        inputRef={textInputRef}
      />
      <Button
        variant="text"
        size="small"
        startIcon={<LinkOutlined />}
        onMouseDown={saveCursorPosition}
        onClick={() => setLinkDialogOpen(true)}
      >
        Insert Link
      </Button>
      <Button
        variant="text"
        size="small"
        startIcon={<PersonOutlined />}
        onMouseDown={saveCursorPosition}
        onClick={(e) => setMergeTagMenuAnchor(e.currentTarget)}
        sx={{ mb: 1 }}
      >
        Insert Merge Tag
      </Button>
      <Menu
        anchorEl={mergeTagMenuAnchor}
        open={Boolean(mergeTagMenuAnchor)}
        onClose={() => setMergeTagMenuAnchor(null)}
      >
        {MAIL_MERGE_TAGS.map((tag) => (
          <MenuItem key={tag} onClick={() => handleInsertMergeTag(tag)}>
            {tag}
          </MenuItem>
        ))}
      </Menu>
      {/* <BooleanInput
        label="Markdown (GitHub flavored)"
        defaultValue={data.props?.markdown ?? TextPropsDefaults.markdown}
        onChange={(markdown) => updateData({ ...data, props: { ...data.props, markdown } })}
      /> */}

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
