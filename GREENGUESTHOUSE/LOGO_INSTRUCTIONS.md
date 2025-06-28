# Logo Integration Instructions

## Current Logo Setup

The header currently uses a placeholder logo with "GGH" initials. To replace it with your actual Green Guest House logo:

## Option 1: Using Image File

1. **Add your logo image** to the `public` folder:
   - Place your logo file (e.g., `logo.png`, `logo.jpg`, or `logo.svg`) in the `GREENGUESTHOUSE/public/` directory

2. **Update the header code** in `src/main.jsx`:
   - Find the logo section in the Header component (around line 15-25)
   - Replace the placeholder div with your image:

```jsx
{/* Replace this placeholder div: */}
<div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
  GGH
</div>

{/* With your actual logo image: */}
<img 
  src="/your-logo-filename.png" 
  alt="Green Guest House Logo" 
  className="h-12 w-auto mr-3"
/>
```

## Option 2: Using External URL

If your logo is hosted online, you can use the direct URL:

```jsx
<img 
  src="https://your-domain.com/path-to-logo.png" 
  alt="Green Guest House Logo" 
  className="h-12 w-auto mr-3"
/>
```

## Option 3: Using the Canva Design

Since you have a Canva design file, you can:

1. **Export the logo** from Canva as a PNG, JPG, or SVG file
2. **Save it** to the `public` folder
3. **Update the code** as shown in Option 1

## Recommended Logo Specifications

- **Format**: PNG, JPG, or SVG (SVG recommended for scalability)
- **Size**: At least 200x200 pixels (will be scaled down to 48x48px in header)
- **Background**: Transparent or white background works best
- **Aspect Ratio**: Square or close to square for best results

## Testing

After making the changes:
1. Save the file
2. The development server should automatically reload
3. Check that the logo appears correctly in the header
4. Test on both desktop and mobile views

## Notes

- The logo is currently set to 48px height (`h-12` class)
- You can adjust the size by changing the `h-12` class to `h-10` (smaller) or `h-14` (larger)
- The logo appears in both desktop and mobile views
- The brand name "Green Guest House" and location "Thirunallar" appear next to the logo 