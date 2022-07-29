// test.js
import antlr4 from 'antlr4';
import CSharpLexer from './CSharpLexer.js';
import CSharpParser from './CSharpParser.js';
import CSharpParserListener from './CSharpParserListener.js';
import CSharpParserVisitor from './CSharpParserVisitor.js';

const input = `
class Multiple
{
	void Foo()
	{
		var a = 3, b = 2;
	}
}`;
const chars = new antlr4.InputStream(input);
const lexer = new CSharpLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new CSharpParser(tokens);
parser.buildParseTrees = true;
var tree = parser.class_definition();

class Visitor  extends CSharpParserVisitor {
    visitClass_definition(ctx) {
        super.visitClass_definition(ctx);

        if (!ctx) {
        return;
        }

        if (ctx.children) {
        return ctx.children.map(child => {
            // if (child.children && child.children.length != 0) {
            //   return child.accept(this);
            // } else {
            return child.getText();
            // }
        });
        }

    }
}

tree.accept(new Visitor());


// class MyGrammarListener extends CSharpParserListener {
//     constructor() {
//         super();
//     }
   
//     enterKey(ctx) {}
//     exitKey(ctx) {}
//     enterValue(ctx) {}
//     exitValue(ctx) {}
// }

// class KeyPrinter extends MyGrammarListener {
//     // override default listener behavior
//     exitKey(ctx) {
//         console.log("Oh, a key!");
//     }
// }

// var tree = parser.class_definition() // assumes grammar "MyGrammar" has rule "MyStartRule"
// const printer = new KeyPrinter();
// antlr4.tree.ParseTreeWalker.DEFAULT.walk(printer, tree);
