# Testing

This library contains a suite of end-to-end tests that you can perform against NLUDB.

If you are running a private-hosted version of NLUDB, we recommend running this test suite as part of your setup, and then regularly to monitor system health.

## 1. Create a Test User

We recommend creating a test user to isolate any artifacts and workload that testing involves.

## 2. Set Environment Variables

Set the following environment variables for testing:

1. **Your NLUDB API Domain**. If you are using `nludb.com`, this step is not necessary. If you have a private NLUDB installation, use the API domain you normally use.

```
export NLUDB_DOMAIN=http://api.nludb.yourcompany.com/
```

2. **Your NLUDB API key**.

```
export NLUDB_KEY=
```

3. **Your default QA Embedding Model name**. For private installations, this default model bay be custom.

```
export NLUDB_EMBEDDER_QA=st_msmarco_distilbert_base_v3
```

4. **Your default Similarity Embedding Model name**. For private installations, this default model bay be custom.

```
export NLUDB_EMBEDDER_SIM=st_paraphrase_mpnet_base_v2
```

5. **Your default Parsing Model name**. For private installations, this default model bay be custom.

```
export NLUDB_PARSER_DEFAULT=sp_en_core_web_trf
```

## 4. Run the tests

With the environment variables set, run:

```
yarn test
```
