'user strict';
var template = require('babel-template');
var build = template(';(function () {\nBODY;\n})();')

module.exports = function (babel) {
	var t = babel.types;
	return {
		visitor: {
			Program: {
				enter: function (path, state) {
					var extensions = state && state.opts && state.opts.extensions
					var reference = state && state.file && state.file.opts.filename
					var filepath = reference.split('?')[0]
					// console.log('filepath', filepath)

					var run = false
					for (ext of extensions) {
						run = run || filepath.match(ext)
					}
					// console.log('run', run, extensions)

					if (!run) { return }
					// console.log('already parsed', this._cssInJsAlreadyRan)

					if (!this._cssInJsAlreadyRan) {
						this._cssInJsAlreadyRan = true;
						var asd = build({
							BODY: path.node.body
						});
						asd[1].expression.callee.body.directives = path.node.directives;

						path.replaceWith(
							t.program(asd)
						);
					}
					path.node.directives = [];
				}
			}
		}
	};
};
