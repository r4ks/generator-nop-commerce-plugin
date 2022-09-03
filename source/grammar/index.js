// test.js
import antlr4 from 'antlr4';
import CSharpLexer from './CSharpLexer.js';
import CSharpParser from './CSharpParser.js';
import CSharpParserListener from './CSharpParserListener.js';
import CSharpParserVisitor from './CSharpParserVisitor.js';
// import BufferedTokenStream from "antlr4/BufferedTokenStream";
// import { Token } from 'antlr4/Token';
import * as fs from 'fs';
import * as path from 'path';
import BufferedTokenStream from './BufferedTokenStream.js';
import TokenStreamRewriter from './TokenStreamRewritter.js';
import CommonTokenStream from './CommonTokenStream.js';

const input = `
class Multiple
{
	void Foo()
	{
		var a = 3, b = 2;
	}
}`;

var p = "source/Nop.Plugin.Widgets.HumanResource/Web/Infrastructure/PluginNopStartup.cs";

var text = "";
try {
    text = fs.readFileSync(p, "utf-8").toString();
    // console.log(text.toString());
} catch(e) {
    console.log(e);
}

const chars = new antlr4.InputStream(text);
const lexer = new CSharpLexer(chars);
const tokens = new CommonTokenStream(lexer, undefined);

// const comments = new antlr4.CommonTokenStream(lexer, CSharpLexer.COMMENTS_CHANNEL);
// const spaces = new antlr4.CommonTokenStream(lexer, CSharpLexer.HIDDEN);
// const sp = new CSharpParser(comments);
// const cp = new CSharpParser(spaces);
// var st = sp.compilation_unit();
// var ct = cp.compilation_unit();
// console.log(
//     "$==================================================================",
//     antlr4.tree.Trees.toStringTree(st, st.parser.ruleNames),
//     "$==================================================================",
//     );
const rewriter = new TokenStreamRewriter(tokens);
const parser = new CSharpParser(tokens);
// const ctree = parser.chunk();

parser.buildParseTrees = true;
rewriter.buildParseTrees = true;
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
    // _tokens: BufferedTokenStream;
    // semi: Token[];

    constructor(tokens){
        super(tokens);
        this._tokens = tokens;
        // console.log(tokens);
    }

	exitNamespace_body(ctx) {
        console.log("enter namespace declaration at:", ctx.start.line);
        console.log("enter namespace declaration for:", ctx.getText());
        rewriter.insertAfter(ctx.start.tokenIndex, "\n***NEW=CODE***");
	}


	enterUsingNamespaceDirective(ctx) {
        console.log("enter using statement at:", ctx.start.line);
        console.log("enter using statement for:", ctx.getText());
	}

	exitUsingNamespaceDirective(ctx) {
        console.log("exit using statement at:", ctx.start.line);
        console.log("exit using statement for:", ctx.getText());
	}

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

	// Enter a parse tree produced by CSharpParser#class_body.
	enterClass_body(ctx) {
	}

	// Exit a parse tree produced by CSharpParser#class_body.
	exitClass_body(ctx) {
	}


	// Enter a parse tree produced by CSharpParser#class_member_declarations.
	enterClass_member_declarations(ctx) {
	}

	// Exit a parse tree produced by CSharpParser#class_member_declarations.
	exitClass_member_declarations(ctx) {
	}

	// Enter a parse tree produced by CSharpParser#class_definition.
	enterClass_definition(ctx) {
        // var cmtChannel  = this._tokens.getHiddenTokensToRight(ctx.tokenIndex, CSharpLexer.COMMENTS_CHANNEL);
        // var cmtChannel  = this._tokens.previousTokenOnChannel(ctx.tokenIndex, CSharpLexer.HIDDEN);
        // var cmtChannel  = this._tokens.nextTokenOnChannel(ctx.tokenIndex, CSharpLexer.HIDDEN);
        // if(cmtChannel != null) {
        //     let cmt = cmtChannel.get(0);
        //     let txt = cmt.text;
        //     console.log("**************************************************************");
        //     console.log(txt);
        //     console.log("**************************************************************");
        // }
	}

	// Exit a parse tree produced by CSharpParser#class_definition.
	exitClass_definition(ctx) {
	}
}

var tree = parser.compilation_unit();
// var tree = parser.using_directives(); // assumes grammar "MyGrammar" has rule "MyStartRule"
const printer = new KeyPrinter(rewriter);
antlr4.tree.ParseTreeWalker.DEFAULT.walk(printer, tree);

// print the code as it was without pretty printting.
// console.log(antlr4.tree.Trees.toStringTree(tree, tree.parser.ruleNames));
// console.log(tokens.getText()); // re-print source code from CommonTokenStream
console.log(rewriter.getText()); // re-print source code from CommonTokenStream

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ List all Files ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const getAllFiles = function(dirPath, arrayOfFiles) {
  var files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const result = getAllFiles("source/Nop.Plugin.Widgets.HumanResource/", []);
var projectFiles = result.filter(i => i.includes(".cs"))
const csprojFiles = projectFiles.filter(i => i.includes(".csproj"))
projectFiles = projectFiles.filter(i => !i.includes(".csproj"))

const cshtmlFiles = projectFiles.filter(i => i.includes(".cshtml"))
projectFiles = projectFiles.filter(i => !i.includes(".cshtml"))
const cssFiles = projectFiles.filter(i => i.includes(".css"))
projectFiles = projectFiles.filter(i => !i.includes(".css"))

const otherFiles = result.filter(i => !i.includes(".cs"))
console.log(projectFiles);
console.log(cssFiles);
console.log(cshtmlFiles);
console.log(csprojFiles);
console.log(otherFiles);
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ end List all Files ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^