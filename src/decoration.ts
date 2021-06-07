import { DecorationRenderOptions, OverviewRulerLane, WorkspaceConfiguration } from 'vscode';
import { EXCLUDE, INCLUDE } from './constants';

type keywordsSetting = {
    keyword: string;
    decorationType: string;
    primaryColor: string;
    secondaryColor: string;
    borderWidth: string;
    borderRadius: string;
};

export class Decoration {
    private static filesToInclude: string[];
    private static filesToExclude: string[];
    private static decorationOptions: Record<string, DecorationRenderOptions> = {};

    public static decoration(keyword: string): DecorationRenderOptions {
        return Decoration.decorationOptions[keyword];
    }

    public static include(): string[] {
        return Decoration.filesToInclude;
    }

    public static exclude(): string[] {
        return Decoration.filesToExclude;
    }

    public static init(config: WorkspaceConfiguration): void {
        const include = config.get<string[]>('include');
        const exclude = config.get<string[]>('exclude');
        const keywordsSettings = config.get<keywordsSetting[]>('keywordsSettings');
        const enableRuler = config.get<boolean>('enableRuler');
        const rulerPosition = config.get<'Left' | 'Right' | 'Center' | 'Full'>('rulerPosition');

        Decoration.filesToInclude = include || INCLUDE;
        Decoration.filesToExclude = exclude || EXCLUDE;

        if (!keywordsSettings || !keywordsSettings.length) return;

        for (let i = 0; i < keywordsSettings.length; i++) {
            const keywordsSetting = keywordsSettings[i];

            let keywordDecorations: DecorationRenderOptions = {};

            keywordDecorations.color = keywordsSetting.primaryColor;

            if (keywordsSetting.decorationType === 'background') {
                keywordDecorations.backgroundColor = keywordsSetting.secondaryColor;
                keywordDecorations.border = 'none';
                keywordDecorations.borderRadius = keywordsSetting.borderRadius ?? '5px';
            } else if (keywordsSetting.decorationType === 'border') {
                keywordDecorations.backgroundColor = 'transparent';
                keywordDecorations.borderStyle = 'solid';
                keywordDecorations.borderColor = keywordsSetting.secondaryColor;
                keywordDecorations.borderWidth = keywordsSetting.borderWidth ?? '1px';
                keywordDecorations.borderRadius = keywordsSetting.borderRadius ?? '5px';
            } else {
                keywordDecorations.backgroundColor = 'transparent';
                keywordDecorations.border = 'none';
            }

            if (enableRuler) {
                keywordDecorations.overviewRulerColor = keywordsSetting.secondaryColor;
                keywordDecorations.overviewRulerLane = OverviewRulerLane[rulerPosition ?? 'Center'];
            } else {
                keywordDecorations.overviewRulerColor = 'transparent';
            }

            Decoration.decorationOptions[keywordsSetting.keyword] = keywordDecorations;
        }
    }

    public static getKeywords(): string[] {
        return Object.keys(Decoration.decorationOptions);
    }
}
