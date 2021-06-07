## Good to know

"keyword": whatever you want the extension to highlight  
"decorationType": background, border or textonly  
"primaryColor": CSS property  
"secondaryColor": CSS property (optional for textonly)  
"borderRadius": CSS property (optional)  
"borderWidth": CSS property (optional)  

## Example (see screenshot for result)

```json
  "todoHighlighterExtra.keywordsSettings": [
    {
      "keyword": "TODO:",
      "decorationType": "background",
      "primaryColor": "#f1f1f1",
      "secondaryColor": "#e5aa25",
      "borderRadius": "5px"
    },
    {
      "keyword": "FIXME:",
      "decorationType": "border",
      "primaryColor": "#f1f1f1",
      "secondaryColor": "#3b3bff",
      "borderRadius": "5px",
      "borderWidth": "1px"
    },
    {
      "keyword": "NOTE:",
      "decorationType": "textonly",
      "primaryColor": "#e5aa25"
    }
  ]
```

Add this to your `settings.json` file.

## Preview

![preview](https://i.imgur.com/QxkWxn5.png)
