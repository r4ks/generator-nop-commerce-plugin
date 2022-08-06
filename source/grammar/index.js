// test.js
import antlr4 from 'antlr4';
import CSharpLexer from './CSharpLexer.js';
import CSharpParser from './CSharpParser.js';
import CSharpParserListener from './CSharpParserListener.js';
import CSharpParserVisitor from './CSharpParserVisitor.js';
import * as fs from 'fs';

const input = `
class Multiple
{
	void Foo()
	{
		var a = 3, b = 2;
	}
}`;

var path = "source/Nop.Plugin.Widgets.HumanResource/Web/Infrastructure/PluginNopStartup.cs";

var text = "";
try {
    text = fs.readFileSync(path, "utf-8").toString();
    // console.log(text.toString());
} catch(e) {
    console.log(e);
}

const chars = new antlr4.InputStream(text);
const lexer = new CSharpLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new CSharpParser(tokens);
parser.buildParseTrees = true;
// var tree = parser.method_declaration();

// class Visitor  extends CSharpParserVisitor {
//     visitMethod_declaration(ctx) {
//         // super.visitClass_definition(ctx);

//         if (!ctx) {
//         return;
//         }

//         if (ctx.children) {
//         var childrens = ctx.children.map(child => {
//             if (child.children && child.children.length != 0) {
//               return child.accept(this);
//             } else {
//             return child.getText();
//             }
//         });
//         return childrens;
//         }

//     }
// }

// tree.accept(new Visitor());


class KeyPrinter extends CSharpParserListener {

    // override default listener behavior
    enterMethod_body(ctx) {
        console.log("enter method body start at:", ctx.start.line);
        // don't know what is for this two:
        // console.log("enter method body at:", ctx.getAltNumber());
        // console.log("enter method body at:", ctx.depth());
        console.log("enter method body for:", ctx.getText());
    }

    enterMethod_declaration(ctx) {
        console.log("exit method declaration at:", ctx.start.line);
        console.log("exit method declaration at:", ctx.getText());
    }

    exitMethod_declaration(ctx) {
        console.log("exit method declaration at:", ctx.start.line);
        console.log("exit method declaration at:", ctx.getText());
    }

    enterMethod_member_name(ctx) {
        console.log("enter method member name at:", ctx.start.line);
        console.log("enter method member name for:", ctx.getText());
    }
}

var tree = parser.compilation_unit();
// var tree = parser.using_directives(); // assumes grammar "MyGrammar" has rule "MyStartRule"
const printer = new KeyPrinter();
antlr4.tree.ParseTreeWalker.DEFAULT.walk(printer, tree);

// print the code as it was without pretty printting.
// console.log(antlr4.tree.Trees.toStringTree(tree, tree.parser.ruleNames));
