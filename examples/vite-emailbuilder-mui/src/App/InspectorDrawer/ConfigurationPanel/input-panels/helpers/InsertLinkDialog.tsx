import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

type InsertLinkDialogProps = {
  onClose: () => void;
  onInsert: (markdownLink: string) => void;
};

export default function InsertLinkDialog({ onClose, onInsert }: InsertLinkDialogProps) {
  const [linkText, setLinkText] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (linkText && url) {
      onInsert(`[${linkText}](${url})`);
      onClose();
    }
  };

  const isValid = linkText.trim() !== '' && url.trim() !== '';

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Insert Link</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Link Text"
            placeholder="Click here"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            variant="outlined"
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            label="URL"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={!isValid}>
            Insert
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
