import React from 'react';

import { Stack, TextField } from '@mui/material';

import { TMessageMetadata } from '../../documents/editor/core';
import { setDocument, useDocument } from '../../documents/editor/EditorContext';

export default function MessagePanel() {
  const document = useDocument();
  const meta: TMessageMetadata = document._meta ?? {};

  const updateMeta = (updates: Partial<TMessageMetadata>) => {
    setDocument({
      _meta: { ...meta, ...updates },
    } as ReturnType<typeof useDocument>);
  };

  return (
    <Stack spacing={3} p={2}>
      <TextField
        fullWidth
        variant="standard"
        label="Name"
        value={meta.name ?? ''}
        onChange={(e) => updateMeta({ name: e.target.value })}
      />
      <TextField
        fullWidth
        variant="standard"
        label="From Name"
        value={meta.fromName ?? ''}
        onChange={(e) => updateMeta({ fromName: e.target.value })}
      />
      <TextField
        fullWidth
        variant="standard"
        label="From Email"
        value={meta.fromEmail ?? ''}
        onChange={(e) => updateMeta({ fromEmail: e.target.value })}
      />
      <TextField
        fullWidth
        variant="standard"
        label="Subject"
        value={meta.subject ?? ''}
        onChange={(e) => updateMeta({ subject: e.target.value })}
      />
    </Stack>
  );
}
