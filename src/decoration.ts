import { DecorationRangeBehavior, DecorationRenderOptions } from 'vscode';

export class Decoration {
  private static decorationOptions: DecorationRenderOptions = {
    color: '#f1f1f1',
    backgroundColor: '#e5aa25',
    rangeBehavior: DecorationRangeBehavior.ClosedClosed
  };


  public static decorations(): DecorationRenderOptions {
    return Decoration.decorationOptions;
  }
}
