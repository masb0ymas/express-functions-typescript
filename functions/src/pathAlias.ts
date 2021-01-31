import * as ModuleAlias from 'module-alias'

ModuleAlias.addAliases({
  '@bin': `${__dirname}/bin`,
  '@config': `${__dirname}/config`,
  '@constants': `${__dirname}/constants`,
  '@controllers': `${__dirname}/controllers`,
  '@helpers': `${__dirname}/helpers`,
  '@interfaces': `${__dirname}/interfaces`,
  '@middlewares': `${__dirname}/middlewares`,
  '@migrations': `${__dirname}/migrations`,
  '@models': `${__dirname}/models`,
  '@modules': `${__dirname}/modules`,
  '@routes': `${__dirname}/routes`,
  '@utils': `${__dirname}/utils`,
  '@views': `${__dirname}/views`,
})
