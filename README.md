# cantina-plus
![GitHub repo size](https://img.shields.io/github/repo-size/sbenstewart/cantina-plus)

An efficient and usable client-side cross platform compatible phishing prevention application.

![](images/gif.gif)

## Module architecture

<img src="images/HLLDia/base/HLLDia.png" alt="Pi-art" width="500">

## Folder structure explained

```brainfuck
cantina-plus
├── code ()
│   ├── addon                       (chrome extensions)
│   │   ├── background script
│   │   └── content script
│   ├── phish detection             (safe or phish)
│   └── target identification       (most similar site)
├── contents                        (fyp submit data)
│   ├── done
│   ├── notdone
│   └── teamlist                    (2020 passouts)
├── documentation
│   └── (n)th review                (total 3 reviews)
│       ├── doc
│       └── pdf
├── images
│   ├── image
│   │   ├── drawio                  (import in drawio)
│   │   └── png
│   └── screenshots
├── mail these                      (mail before review)
│   └── (n)th review
│       ├── ppt
│       ├── pdf
│       └── zip
├── papers                          (ieee only)
│   ├── literature survey           (base for base)     
│   │   └──surveys
│   └── pdf                         (base)
├── presentation                    (total 3 reviews)
│   └── (n)th review
│       ├── pptx
│       └── pdf
├── samples                         (samples)
├── thesis                          (latex nightmare)
├──LICENCE
└──README.md
```

## Road map
* Use python http clients to remove dependency on php.
* Update plain text whitelist.
* Use custom tree datastructure instead of files for whitelist.
* Make python installable package.

## Contributing for cantina-plus
To contribute for cantina-plus, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <user_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Before contirbuting, beware that you might be summoned before the panel to explain the pull request, with docs and decks.


## The legal stuff

All the content which includes the code, the documentation and the decks are under an [MIT License](/LICENSE). Click on them to read in detail about what they mean and how you can use them.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Acknowledgements
Down here I would like to acknowledge all those who made cantina-plus possible.

* My awesome team mates [N.Dhanush](https://github.com/SimplyMrD) and [G.Santhosh](https://github.com/gsanthosh98) without whom it would not have been such fun doing a final year project.
* [Dr. Angelin Gladston](mailto:angel@cs.annauniv.edu) for guiding cantina-plus to it's completion. 
* [The panel from the Department of Computer Science and Engineering, CEG](http://cs.annauniv.edu/people/teaching.php) who gave meaningful inputs to make cantina-plus better.
* [Google Docs and Slides](https://docs.google.com) for making the team collaboration a lot easier.
* [Drawio Chrome App](https://chrome.google.com/webstore/detail/diagramsnet-desktop/pebppomjfocnoigkeepgbmcifnnlndla?hl=en-GB) that made it possible to easily render the images.
* [LaTeX](https://en.wikipedia.org/wiki/LaTeX) for making it way harder to submit cantina-plus as a thesis.

## Contact

If you want to contact me you can reach me at <sbenstewart@gmail.com>.

<h3>Have a great day :)</h3>



