---
title: Netzbauplan PDF Extraction
provenance: hand written
description: "The prompt I used to extract tabular data from a PDF. In the end model choice seemed to have the biggest impact (Claude won). https://martinklepsch.org/posts/pdf-to-csv-with-gemini-and-claude.html"
---
Extract the tabular data on this page as csv. Respond with only the content of the csv file without any additional text.

Ignore any linebreaks in the table cells. Make sure to quote every cell value.
When encountering empty cells, provide an empty string as value.

You must extract ALL the information available in the entire document.

