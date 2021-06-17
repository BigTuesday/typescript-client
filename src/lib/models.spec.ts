import test from 'ava';

import { nludb_client, random_name } from './helper.spec';
import { CreateModelRequest, ModelAdapterType, ModelType } from './types/models';

test('Test Model Create', async (t) => {
  const nludb = nludb_client();

  t.throwsAsync(async () => {
    await nludb.models.create({
      description: "This is just for test",
      modelType: ModelType.embedder,
      url: "http://foo",
      adapterType: ModelAdapterType.nludbDocker,
      isPublic: true
    } as CreateModelRequest)
  });

  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      modelType: ModelType.embedder,
      url: "http://foo",
      adapterType: ModelAdapterType.nludbDocker,
      isPublic: true
    } as CreateModelRequest)
  });

  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      description: "This is just for test",
      url: "http://foo",
      adapterType: ModelAdapterType.nludbDocker,
      isPublic: true
    } as CreateModelRequest)
  });

  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      description: "This is just for test",
      modelType: ModelType.embedder,
      adapterType: ModelAdapterType.nludbDocker,
      isPublic: true
    } as CreateModelRequest)
  });

  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      description: "This is just for test",
      modelType: ModelType.embedder,
      url: "http://foo",
      isPublic: true
    } as CreateModelRequest)
  });

  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      description: "This is just for test",
      modelType: ModelType.embedder,
      url: "http://foo",
      adapterType: ModelAdapterType.nludbDocker,
    } as CreateModelRequest)
  });

  const models = await nludb.models.listPrivate();
  t.is(models.models.length, 0);

  const model = await nludb.models.create({
    name: random_name(),
    description: "This is just for test",
    modelType: ModelType.embedder,
    url: "http://foo",
    adapterType: ModelAdapterType.nludbDocker,
    isPublic: true
  })

  const models2 = await nludb.models.listPrivate();
  t.is(models2.models.length, 1);

  // Upsert
  t.throwsAsync(async () => {
    await nludb.models.create({
      name: random_name(),
      description: "This is just for test",
      modelType: ModelType.embedder,
      url: "http://foo",
      adapterType: ModelAdapterType.nludbDocker,
      isPublic: true
    })
  });

  const model2 = await nludb.models.create({
    name: random_name(),
    description: "This is just for test 2",
    modelType: ModelType.embedder,
    url: "http://foo",
    adapterType: ModelAdapterType.nludbDocker,
    isPublic: true,
    upsert: true
  })

  t.is(model2.id, model.id)

  const models3 = await nludb.models.listPrivate();
  t.is(models3.models.length, 1)
  t.is(models3.models[0].id, models.models[0].id)
  t.is(models2.models[0].description, models.models[0].description)
  // Upsert really doesn't update yet. Just retrieves old one.
  // t.is(models3.models[0].description, models.models[0].description)

  await nludb.models.delete({modelId: model.id})

  const models4 = await nludb.models.listPrivate();
  t.is(models4.models.length, 0)
});
