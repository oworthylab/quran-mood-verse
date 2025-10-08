import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/gql/schema.ts',
  documents: ['./src/**/*.{ts,tsx}'],
  generates: {
    './src/gql/artifacts/': {
      preset: 'client',
      presetConfig: { gqlTagName: 'gql' },
      config: {
        inputMaybeValue: 'T | undefined',
        scalars: {
          DateTime: 'string',
          SanitizedString: 'string',
          SortByString: 'string',
        },
      },
    },

    './src/gql/artifacts/resolvers.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        { add: { content: "import { DeepPartial } from 'utility-types';" } },
      ],
      config: {
        useIndexSignature: true,
        defaultMapper: 'DeepPartial<{T}>',
        extractAllFieldsToTypes: true,
        inputMaybeValue: 'T | undefined',
        scalars: {
          DateTime: 'Date',
          SanitizedString: 'string',
        },
      },
    },
  },

  ignoreNoDocuments: true,
  noSilentErrors: true,
  verbose: true,
}

export default config
