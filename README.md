# vscode-ext-key-logger README

キーの押下タイミングを記録する簡易ロガー。

VSCode は生 KeyUp/Down イベントを拡張機能側に公開していないのでテキストの変更で取る。

`vscode-ext-key-logger.outFile` を設定しておくと、ファイルに書き出す。
