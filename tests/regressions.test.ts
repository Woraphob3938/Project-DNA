import assert from 'node:assert/strict';
import test from 'node:test';

import type { AuthClientFactory } from '../src/lib/apiAuth';
import { DnaService } from '../src/lib/dnaService';
import { deleteProjectIfSuccessful } from '../src/lib/projectActions';
import { requireAuthenticatedUser } from '../src/lib/apiAuth';

test('project submission reports a rejected Supabase insert', async () => {
  const client = {
    auth: {
      getUser: async () => ({ data: { user: { id: 'user-1' } } }),
    },
    from: () => ({
      insert: async () => ({ error: new Error('project insert rejected') }),
    }),
  } as unknown as ConstructorParameters<typeof DnaService>[0];
  const service = new DnaService(client, true);

  await service.createProject({ title_th: 'โครงงานทดสอบ' });

  assert.equal(service.getLastSyncWarning(), 'project insert rejected');
});

test('failed project deletion does not authorize UI removal', async () => {
  const shouldRemoveFromUi = await deleteProjectIfSuccessful(
    'project-1',
    async () => ({ deleted: false, warning: 'not owner' })
  );

  assert.equal(shouldRemoveFromUi, false);
});

test('unauthenticated AI requests are rejected with 401', async () => {
  const getClient = (() => ({
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  })) as unknown as AuthClientFactory;

  const response = await requireAuthenticatedUser(
    getClient,
    async () => ({}) as Parameters<AuthClientFactory>[0]
  );

  assert.equal(response?.status, 401);
});
