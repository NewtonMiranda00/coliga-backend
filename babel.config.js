module.exports = {
  presets: [
    [
      '@babel/preset-env', 
      {
        targets: {
          node: 'current'
        }
      } 
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        "@controllers": "./src/controllers/",
        "@database": "./src/database/",
        "@middlewares": "./src/middlewares/",
        "@models": "./src/models/",
        "@resources": "./src/resources/",
        "@routes": "./src/routes/",
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
