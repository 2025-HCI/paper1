// CodeMirror 초기화
let editor;
let latexSource = "";

// 로그 패널 토글 함수
function toggleLogs() {
  const logPanel = document.getElementById("log-panel");
  logPanel.style.display = logPanel.style.display === "none" ? "block" : "none";
}

// 로그 메시지 추가 함수
function addLog(message, type = "info") {
  const logPanel = document.getElementById("log-panel");
  const logEntry = document.createElement("div");
  logEntry.textContent = message;
  logEntry.className = type;
  logPanel.appendChild(logEntry);
  logPanel.scrollTop = logPanel.scrollHeight;

  // 로그 패널이 숨겨져 있으면 표시
  if (logPanel.style.display === "none" || !logPanel.style.display) {
    logPanel.style.display = "block";
  }

  // 5초 후 자동으로 숨기기
  setTimeout(() => {
    if (logPanel.children.length <= 1) {
      logPanel.style.display = "none";
    }
    if (logPanel.contains(logEntry)) {
      logPanel.removeChild(logEntry);
    }
  }, 5000);
}

// 참고 자료 형식
const references = [
  {
    id: "3dconnexion2021",
    author: "3dconnexion",
    title: "Space Mouse 3D input Device",
    year: "2021",
    url: "http://www.3dconnexion.fr/nc/company/press-room/",
  },
  {
    id: "adhanom2023",
    author: "Isayas Berhe Adhanom, Paul MacNeilage, and Eelke Folmer",
    title:
      "Eye tracking in virtual reality: a broad review of applications and challenges",
    year: "2023",
    journal: "Virtual Reality",
    volume: "27",
    number: "2",
    pages: "1481–1505",
  },
  {
    id: "asahina2021",
    author:
      "Ray Asahina, Takashi Nomoto, Takatoshi Yoshida, and Yoshihiro Watanabe",
    title:
      "Realistic 3D swept-volume display with hidden-surface removal using physical materials",
    year: "2021",
    journal: "IEEE Virtual Reality and 3D User Interfaces (VR)",
    pages: "113–121",
  },
  {
    id: "balakrishnan2001",
    author: "Ravin Balakrishnan, George W Fitzmaurice, and Gordon Kurtenbach",
    title: "User interfaces for volumetric displays",
    year: "2001",
    journal: "Computer",
    volume: "34",
    number: "3",
    pages: "37–45",
  },
  {
    id: "barnum2010",
    author: "Peter C. Barnum, Srinivasa G. Narasimhan, and Takeo Kanade",
    title: "A multi-layered display with water drops",
    year: "2010",
    journal: "ACM SIGGRAPH 2010 papers",
    pages: "1–7",
    doi: "10.1145/1833349.1778813",
  },
  {
    id: "bryson2005",
    author: "Steve Bryson",
    title: "Direct Manipulation in Virtual Reality",
    year: "2005",
    booktitle: "Visualization Handbook",
    publisher: "Elsevier",
    pages: "413–430",
    doi: "10.1016/B978-012387582-2/50023-X",
  },
  {
    id: "carter2013",
    author:
      "Tom Carter, Sue Ann Seah, Benjamin Long, Bruce Drinkwater, and Sriram Subramanian",
    title:
      "UltraHaptics: multi-point mid-air haptic feedback for touch surfaces",
    year: "2013",
    booktitle:
      "Proceedings of the 26th annual ACM symposium on User interface software and technology",
    pages: "505–514",
  },
  {
    id: "cassinelli2005",
    author: "Alvaro Cassinelli and Masatoshi Ishikawa",
    title: "Khronos projector",
    year: "2005",
    booktitle: "ACM SIGGRAPH 2005 Emerging technologies",
    pages: "10",
    doi: "10.1145/1187297.1187308",
  },
  {
    id: "dand2013",
    author: "Dhairya Dand and Robert Hemsley",
    title: "Obake: interactions on a 2.5 D elastic display",
    year: "2013",
    booktitle:
      "Adjunct Proceedings of the 26th Annual ACM Symposium on User Interface Software and Technology",
    pages: "109–110",
  },
  {
    id: "dang2007",
    author: "Nguyen-Thong Dang",
    title: "A survey and classification of 3D pointing techniques",
    year: "2007",
    booktitle:
      "IEEE international conference on research, innovation and vision for the future",
    pages: "71–80",
  },
  {
    id: "eitoku2006",
    author: "S. Eitoku, T. Tanikawa, and Y. Suzuki",
    title:
      "Display Composed of Water Drops for Filling Space with Materialized Virtual Three-dimensional Objects",
    year: "2006",
    booktitle: "IEEE Virtual Reality Conference (VR 2006)",
    pages: "159–166",
    doi: "10.1109/VR.2006.51",
  },
  {
    id: "feix2016",
    author:
      "Thomas Feix, Javier Romero, Heinz-Bodo Schmiedmayer, Aaron M. Dollar, and Danica Kragic",
    title: "The GRASP Taxonomy of Human Grasp Types",
    year: "2016",
    journal: "IEEE Transactions on Human-Machine Systems",
    volume: "46",
    number: "1",
    pages: "66–77",
    doi: "10.1109/THMS.2015.2470657",
  },
  {
    id: "fernandez2024",
    author:
      "Unai Javier Fernández, Iosune Sarasate, Iñigo Ezcurdia, Manuel Lopez-Amo, Ivan Fernández, and Asier Marzo",
    title: "PointerVol: A Laser Pointer for Swept Volumetric Displays",
    year: "2024",
    booktitle:
      "Proceedings of the 37th Annual ACM Symposium on User Interface Software and Technology (UIST ’24)",
    pages: "1–8",
    doi: "10.1145/3654777.3676432",
  },
  {
    id: "forlines2007",
    author:
      "Clifton Forlines, Daniel Wigdor, Chia Shen, and Ravin Balakrishnan",
    title: "Direct-touch vs. mouse input for tabletop displays",
    year: "2007",
    booktitle:
      "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI ’07)",
    pages: "647–656",
    doi: "10.1145/1240624.1240726",
  },
  {
    id: "fushimi2019",
    author:
      "Tatsuki Fushimi, Asier Marzo, Bruce W Drinkwater, and Thomas L Hill",
    title:
      "Acoustophoretic volumetric displays using a fast-moving levitated particle",
    year: "2019",
    journal: "Applied Physics Letters",
    volume: "115",
    number: "6",
  },
  {
    id: "goldstein2002",
    author: "E Bruce Goldstein and James R Brockmole",
    title: "Sensation and perception",
    year: "2002",
    volume: "90",
    publisher: "Wadsworth-Thomson Learning Pacifc Grove, CA, USA",
  },
  {
    id: "grossman2006",
    author: "Tovi Grossman and Ravin Balakrishnan",
    title:
      "The design and evaluation of selection techniques for 3D volumetric displays",
    year: "2006",
    booktitle:
      "Proceedings of the 19th annual ACM symposium on User interface software and technology",
    pages: "3–12",
  },
  {
    id: "grossman2004",
    author: "Tovi Grossman, Daniel Wigdor, and Ravin Balakrishnan",
    title: "Multi-finger gestural interaction with 3d volumetric displays",
    year: "2004",
    booktitle:
      "Proceedings of the 17th annual ACM symposium on User interface software and technology",
    pages: "61–70",
  },
  {
    id: "hahn2023",
    author:
      "Joonku Hahn, Woonchan Moon, Hosung Jeon, Minwoo Jung, Seongju Lee, Gunhee Lee, and Muhan Choi",
    title: "Volumetric 3D Display: Features and Classification",
    year: "2023",
    journal: "Current Optics and Photonics",
    volume: "7",
    number: "6",
    pages: "597–607",
  },
  {
    id: "hart1988",
    author: "Sandra G. Hart and Lowell E. Staveland",
    title:
      "Development of NASA-TLX (Task Load Index): Results of Empirical and Theoretical Research",
    year: "1988",
    booktitle: "Advances in Psychology",
    volume: "52",
    pages: "139–183",
    doi: "10.1016/S0166-4115(08)62386-9",
  },
  {
    id: "hilliges2012",
    author:
      "Otmar Hilliges, David Kim, Shahram Izadi, Malte Weiss, and Andrew Wilson",
    title:
      "HoloDesk: direct 3d interactions with a situated see-through display",
    year: "2012",
    booktitle:
      "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
    pages: "2421–2430",
  },
  {
    id: "hirayama2019",
    author:
      "Ryuji Hirayama, Diego Martinez Plasencia, Nobuyuki Masuda, and Sriram Subramanian",
    title:
      "A volumetric display for visual, tactile and audio presentation using acoustic trapping",
    year: "2019",
    journal: "Nature",
    volume: "575",
    number: "7782",
    pages: "320–323",
  },
  {
    id: "huber2015",
    author: "Paul Huber",
    title: "Inaccurate input on touch devices relating to the fingertip",
    year: "2015",
    booktitle: "Media Informatics Proseminar on Interactive Surfaces",
    volume: "31",
  },
  {
    id: "lumi2017",
    author: "Lumi Industries",
    title: "VVD: Volumetric Visualization Device",
    year: "2017",
    url: "https://www.lumindustries.com/3d-vis",
  },
  {
    id: "ishii2012",
    author:
      "Hiroshi Ishii, Dávid Lakatos, Leonardo Bonanni, and Jean-Baptiste Labrune",
    title:
      "Radical atoms: beyond tangible bits, toward transformable materials",
    year: "2012",
    journal: "interactions",
    volume: "19",
    number: "1",
    pages: "38–51",
  },
  {
    id: "jankowski2013",
    author: "Jacek Jankowski and Martin Hachet",
    title: "A survey of interaction techniques for interactive 3D environments",
    year: "2013",
    booktitle: "Eurographics 2013-STAR",
  },
  {
    id: "jiang2021",
    author:
      "Ying Jiang, Congyi Zhang, Hongbo Fu, Alberto Cannavò, Fabrizio Lamberti, Henry Y K Lau, and Wenping Wang",
    title: "HandPainter -3D Sketching in VR with Hand-based Physical Proxy",
    year: "2021",
    booktitle:
      "Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (CHI ’21)",
    doi: "10.1145/3411764.3445302",
  },
  {
    id: "jones2007",
    author:
      "Andrew Jones, Ian McDowall, Hideshi Yamada, Mark Bolas, and Paul Debevec",
    title: "Rendering for an interactive 360° light field display",
    year: "2007",
    journal: "ACM Transactions on Graphics",
    volume: "26",
    number: "3",
    pages: "40",
    doi: "10.1145/1276377.1276427",
  },
  {
    id: "karnik2011",
    author:
      "Abhijit Karnik, Archie Henderson, Andrew Dean, Howard Pang, Thomas Campbell, Satoshi Sakurai, Guido Herrmann, Shahram Izadi, Yoshifumi Kitamura, and Sriram Subramanian",
    title:
      "Vortex: Design and implementation of an interactive volumetric display",
    year: "2011",
    booktitle:
      "CHI’11 Extended Abstracts on Human Factors in Computing Systems",
    pages: "2017–2022",
  },
  {
    id: "kimura2011",
    author:
      "Hidei Kimura, Akira Asano, Issei Fujishiro, Ayaka Nakatani, and Hayato Watanabe",
    title: "True 3D display",
    year: "2011",
    booktitle: "ACM SIGGRAPH 2011 Emerging Technologies",
    pages: "1–1",
  },
  {
    id: "kingsley2012",
    author: "Philip Kingsley, J Rossiter, and S Subramanian",
    title: "eTable: A haptic elastic table for 3D multi-touch interactions",
    year: "2012",
    thesis: "Master’s thesis",
    publisher: "University of Bristol",
  },
  {
    id: "kumagai2021",
    author: "Kota Kumagai, Shun Miura, and Yoshio Hayasaki",
    title:
      "Colour volumetric display based on holographic-laser-excited graphics using drawing space separation",
    year: "2021",
    journal: "Scientific Reports",
    volume: "11",
    number: "1",
    pages: "22728",
    doi: "10.1038/s41598-02102107-3",
  },
];

// 참고 자료 목록
// [1] 3dconnexion. 2021. Space Mouse 3D input Device. http://www.3dconnexion.fr/ nc/company/press-room/
// [2] Isayas Berhe Adhanom, Paul MacNeilage, and Eelke Folmer. 2023. Eye tracking in virtual reality: a broad review of applications and challenges. Virtual Reality 27, 2 (2023), 1481–1505.
// [3] Ray Asahina, Takashi Nomoto, Takatoshi Yoshida, and YoshihiroWatanabe. 2021. Realistic 3D swept-volume display with hidden-surface removal using physical materials. In 2021 IEEE Virtual Reality and 3D User Interfaces (VR). IEEE, 113–121.
// [4] Ravin Balakrishnan, George W Fitzmaurice, and Gordon Kurtenbach. 2001. User interfaces for volumetric displays. Computer 34, 3 (2001), 37–45.
// [5] Peter C. Barnum, Srinivasa G. Narasimhan, and Takeo Kanade. 2010. A multi-layered display with water drops. In ACM SIGGRAPH 2010 papers. ACM, Los Angeles California, 1–7. https://doi.org/10.1145/1833349.1778813
// [6] Steve Bryson. 2005. Direct Manipulation in Virtual Reality. In Visualization Handbook. Elsevier, 413–430. https://doi.org/10.1016/B978-012387582-2/50023-X
// [7] Tom Carter, Sue Ann Seah, Benjamin Long, Bruce Drinkwater, and Sriram Subramanian. 2013. UltraHaptics: multi-point mid-air haptic feedback for touch surfaces. In Proceedings of the 26th annual ACM symposium on User interface software and technology. 505–514.
// [8] Alvaro Cassinelli and Masatoshi Ishikawa. 2005. Khronos projector. In ACM SIGGRAPH 2005 Emerging technologies on -SIGGRAPH ’05. ACM Press, Los Angeles, California, 10. https://doi.org/10.1145/1187297.1187308
// [9] Dhairya Dand and Robert Hemsley. 2013. Obake: interactions on a 2.5 D elastic display. In Adjunct Proceedings of the 26th Annual ACM Symposium on User Interface Software and Technology. 109–110.
// [10] Nguyen-Thong Dang. 2007. A survey and classifcation of 3D pointing techniques. In 2007 IEEE international conference on research, innovation and vision for the future. IEEE, 71–80.
// [11] S. Eitoku, T. Tanikawa, and Y. Suzuki. 2006. Display Composed of Water Drops for Filling Space with Materialized Virtual Three-dimensional Objects. In IEEE Virtual Reality Conference (VR 2006). 159–166. https://doi.org/10.1109/VR.2006.51 ISSN: 2375-5334.
// [12] Thomas Feix, Javier Romero, Heinz-Bodo Schmiedmayer, Aaron M. Dollar, and Danica Kragic. 2016. The GRASP Taxonomy of Human Grasp Types. IEEE Transactions on Human-Machine Systems 46, 1 (Feb. 2016), 66–77. https://doi. org/10.1109/THMS.2015.2470657
// [13] Unai Javier Fernández, Iosune Sarasate, Iñigo Ezcurdia, Manuel Lopez-Amo, Ivan Fernández, and Asier Marzo. 2024. PointerVol: A Laser Pointer for Swept Volumetric Displays. In Proceedings of the 37th Annual ACM Symposium on User Interface Software and Technology (UIST ’24). Association for Computing Machinery, New York, NY, USA, 1–8. https://doi.org/10.1145/3654777.3676432
// [14] Clifton Forlines, Daniel Wigdor, Chia Shen, and Ravin Balakrishnan. 2007. Direct-touch vs. mouse input for tabletop displays. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (San Jose, California, USA) (CHI ’07). Association for Computing Machinery, New York, NY, USA, 647–656. https://doi.org/10.1145/1240624.1240726
// [15] Tatsuki Fushimi, Asier Marzo, Bruce W Drinkwater, and Thomas L Hill. 2019. Acoustophoretic volumetric displays using a fast-moving levitated particle. Applied Physics Letters 115, 6 (2019).
// [16] E Bruce Goldstein and James R Brockmole. 2002. Sensation and perception. Vol. 90. Wadsworth-Thomson Learning Pacifc Grove, CA, USA.
// [17] Tovi Grossman and Ravin Balakrishnan. 2006. The design and evaluation of selection techniques for 3D volumetric displays. In Proceedings of the 19th annual ACM symposium on User interface software and technology. 3–12.
// [18] Tovi Grossman, Daniel Wigdor, and Ravin Balakrishnan. 2004. Multi-fnger gestural interaction with 3d volumetric displays. In Proceedings of the 17th annual ACM symposium on User interface software and technology. 61–70.
// [19] Joonku Hahn, Woonchan Moon, Hosung Jeon, Minwoo Jung, Seongju Lee, Gunhee Lee, and Muhan Choi. 2023. Volumetric 3D Display: Features and Classifcation. Current Optics and Photonics 7, 6 (2023), 597–607.
// [20] Sandra G. Hart and Lowell E. Staveland. 1988. Development of NASA-TLX (Task Load Index): Results of Empirical and Theoretical Research. In Advances in Psychology. Vol. 52. Elsevier, 139–183. https://doi.org/10.1016/S0166-4115(08) 62386-9
// [21] Otmar Hilliges, David Kim, Shahram Izadi, Malte Weiss, and Andrew Wilson. 2012. HoloDesk: direct 3d interactions with a situated see-through display. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems. 2421–2430.
// [22] Ryuji Hirayama, Diego Martinez Plasencia, Nobuyuki Masuda, and Sriram Subramanian. 2019. A volumetric display for visual, tactile and audio presentation using acoustic trapping. Nature 575, 7782 (2019), 320–323.
// [23] Paul Huber. 2015. Inaccurate input on touch devices relating to the fngertip. Media Informatics Proseminar on” Interactive Surfaces 31 (2015).
// [24] Lumi Industries. 2017. VVD: Volumetric Visualization Device. https://www. lumindustries.com/3d-vis
// [25] Hiroshi Ishii, Dávid Lakatos, Leonardo Bonanni, and Jean-Baptiste Labrune. 2012. Radical atoms: beyond tangible bits, toward transformable materials. interactions 19, 1 (2012), 38–51.
// [26] Jacek Jankowski and Martin Hachet. 2013. A survey of interaction techniques for interactive 3D environments. In Eurographics 2013-STAR.
// [27] Ying Jiang, Congyi Zhang, Hongbo Fu, Alberto Cannavò, Fabrizio Lamberti, Henry Y K Lau, and Wenping Wang. 2021. HandPainter -3D Sketching in VR with Hand-based Physical Proxy. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21). Association for Computing Machinery, New York, NY, USA, Article 412, 13 pages. https: //doi.org/10.1145/3411764.3445302
// [28] Andrew Jones, Ian McDowall, Hideshi Yamada, Mark Bolas, and Paul Debevec. 2007. Rendering for an interactive 360° light feld display. ACM Transactions on Graphics 26, 3 (July 2007), 40. https://doi.org/10.1145/1276377.1276427
// [29] Abhijit Karnik, Archie Henderson, Andrew Dean, Howard Pang, Thomas Campbell, Satoshi Sakurai, Guido Herrmann, Shahram Izadi, Yoshifumi Kitamura, and Sriram Subramanian. 2011. Vortex: Design and implementation of an interactive volumetric display. In CHI’11 Extended Abstracts on Human Factors in Computing Systems. 2017–2022.
// [30] Hidei Kimura, Akira Asano, Issei Fujishiro, Ayaka Nakatani, and Hayato Watanabe. 2011. True 3D display. In ACM SIGGRAPH 2011 Emerging Technologies. 1–1.
// [31] Philip Kingsley, J Rossiter, and S Subramanian. 2012. eTable: A haptic elastic table for 3D multi-touch interactions. Master’s thesis. University of Bristol (2012).
// [32] Kota Kumagai, Shun Miura, and Yoshio Hayasaki. 2021. Colour volumetric display based on holographic-laser-excited graphics using drawing space separation. Scientifc Reports 11, 1 (Nov. 2021), 22728. https://doi.org/10.1038/s41598-02102107-3

// 인용 관리를 위한 변수
let citationsInDocument = [];

// LaTeX to HTML 컨버터
function parseLatex(latexCode) {
  let content = "";
  let title = "";
  let author = "";
  let date = "";
  let abstract = "";
  let inDocument = false;
  let inAbstract = false;
  let inFigure = false;
  let inTable = false;
  let inEnumerate = false;
  let inItemize = false;
  let currentSection = "";
  let figureCaption = "";
  let tableCaption = "";

  // 캡션 번호 관리를 위한 카운터
  let figureCount = 0;
  let tableCount = 0;

  // 인용 목록 초기화
  citationsInDocument = [];

  // 표/수식/이미지 파싱을 위한 임시 버퍼
  let tableBuffer = [];
  let inTabular = false;

  // 정규식 기반 파싱
  const lines = latexCode.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 제목 추출
    if (line.startsWith("\\title{")) {
      title = line.substring(7, line.length - 1);
    }
    // 저자 추출
    else if (line.startsWith("\\author{")) {
      author = line.substring(8, line.length - 1);
    }
    // 날짜 추출
    else if (line.startsWith("\\date{")) {
      date = line.substring(6, line.length - 1);
    }
    // 문서 시작
    else if (line.startsWith("\\begin{document}")) {
      inDocument = true;
    }
    // 문서 종료
    else if (line.startsWith("\\end{document}")) {
      inDocument = false;
    }
    // 제목 생성 명령
    else if (line === "\\maketitle" && inDocument) {
      content += `<h1 class="title">${title}</h1>`;
      content += `<div class="author">${author}</div>`;
      if (date) {
        content += `<div class="date">${date || "April 21, 2025"}</div>`;
      }
    }
    // 초록 시작
    else if (line.startsWith("\\begin{abstract}") && inDocument) {
      inAbstract = true;
      content += `<div class="abstract"><div class="abstract-title">Abstract</div>`;
    }
    // 초록 종료
    else if (line.startsWith("\\end{abstract}") && inDocument) {
      inAbstract = false;
      content += `</div>`;
    }
    // 섹션 제목
    else if (line.startsWith("\\section{") && inDocument) {
      currentSection = line.substring(9, line.length - 1);
      content += `<h2 class="section">${currentSection}</h2>`;
    }
    // 서브섹션 제목
    else if (line.startsWith("\\subsection{") && inDocument) {
      const subsection = line.substring(12, line.length - 1);
      content += `<h3 class="subsection">${subsection}</h3>`;
    }
    // 그림 시작
    else if (line.startsWith("\\begin{figure}") && inDocument) {
      inFigure = true;
      figureCount++;
      content += `<div class="figure">`;
    }
    // 그림 종료
    else if (line.startsWith("\\end{figure}") && inDocument) {
      inFigure = false;
      content += `</div>`;
    }
    // 테이블 시작
    else if (line.startsWith("\\begin{table}") && inDocument) {
      inTable = true;
      tableCount++;
      content += `<div class="table-container">`;
    }
    // 테이블 종료
    else if (line.startsWith("\\end{table}") && inDocument) {
      inTable = false;
      if (tableCaption) {
        content += `<div class="table-caption">${tableCaption}</div>`;
        tableCaption = "";
      }
      content += `</div>`;
    }
    // 테이블 내용 시작
    else if (line.startsWith("\\begin{tabular}") && inDocument && inTable) {
      inTabular = true;
      tableBuffer = [];
    }
    // 테이블 내용 종료
    else if (line.startsWith("\\end{tabular}") && inDocument && inTable) {
      // 표 렌더링
      content += renderLatexTable(tableBuffer);
      inTabular = false;
      tableBuffer = [];
    }
    // 테이블 행 (tabular 내부)
    else if (inTabular && !line.startsWith("%")) {
      tableBuffer.push(line);
    }
    // 번호 목록 시작
    else if (line.startsWith("\\begin{enumerate}") && inDocument) {
      inEnumerate = true;
      content += `<ol class="enumerated-list">`;
    }
    // 번호 목록 종료
    else if (line.startsWith("\\end{enumerate}") && inDocument) {
      inEnumerate = false;
      content += `</ol>`;
    }
    // 글머리 기호 목록 시작
    else if (line.startsWith("\\begin{itemize}") && inDocument) {
      inItemize = true;
      content += `<ul class="itemized-list">`;
    }
    // 글머리 기호 목록 종료
    else if (line.startsWith("\\end{itemize}") && inDocument) {
      inItemize = false;
      content += `</ul>`;
    }
    // 목록 항목
    else if (line.startsWith("\\item") && (inEnumerate || inItemize)) {
      const itemContent = line.substring(5).trim();
      content += `<li>${itemContent}</li>`;
    }
    // 캡션
    else if (line.startsWith("\\caption{") && inDocument) {
      const captionContent = line.substring(9, line.length - 1);

      // 라벨 제거
      let cleanCaption = captionContent.replace(/\\label\{.*?\}/g, "").trim();

      // 캡션 번호 붙이기
      if (inFigure) {
        content += `<div class="figure-caption">Figure ${figureCount}: ${cleanCaption}</div>`;
      } else if (inTable) {
        tableCaption = `Table ${tableCount}: ${cleanCaption}`;
      }
    }
    // 이미지 (figure 환경 외부도 지원)
    else if (line.includes("\\includegraphics") && inDocument) {
      // 이미지 경로 추출
      const match = line.match(/\\includegraphics(\[.*?\])?\{(.+?)\}/);
      if (match) {
        let src = match[2];
        // frog.jpg는 첨부 이미지, 그 외는 외부 링크
        if (src === "frog.jpg") {
          content += `<img src="frog.jpg" alt="Frog">`;
        } else {
          content += `<img src="${src}" alt="LaTeX Image">`;
        }
      }
    }
    // 수식 블록 (display math)
    else if (
      (line.startsWith("\\[") && line.endsWith("\\]")) ||
      (line.startsWith("$$") && line.endsWith("$$"))
    ) {
      // \[ ... \] 또는 $$ ... $$ 한 줄
      const mathContent = line
        .replace(/^\\\[|\\\]$/g, "")
        .replace(/^\$\$|\$\$$/g, "")
        .trim();
      content += `<div class="math-block">\\[${mathContent}\\]</div>`;
    }
    // 여러 줄 수식 블록 시작
    else if (
      (line.startsWith("\\[") && !line.endsWith("\\]")) ||
      (line.startsWith("$$") && !line.endsWith("$$"))
    ) {
      // 여러 줄 블록 수식
      let mathLines = [];
      let endFound = false;
      let j = i;
      while (j < lines.length && !endFound) {
        let l = lines[j].trim();
        if (
          (l.endsWith("\\]") && l.length > 2) ||
          (l.endsWith("$$") && l.length > 2)
        ) {
          endFound = true;
          l = l.replace(/^\\\[|^\$\$|\\\]$|\$\$$/g, "");
          mathLines.push(l);
        } else if (j === i) {
          l = l.replace(/^\\\[|^\$\$/g, "");
          mathLines.push(l);
        } else {
          mathLines.push(l);
        }
        j++;
      }
      content += `<div class="math-block">\\[${mathLines.join("\n")}\\]</div>`;
      i = j - 1;
    }
    // 테이블 행
    else if (line.includes("&") && inTable && !line.startsWith("%")) {
      // 테이블 헤더인지 확인
      const isHeader = line.includes("\\hline");

      // & 기호로 셀 분리
      let cells = line.split("&").map((cell) => cell.trim());

      // \\ 및 \hline 제거
      for (let j = 0; j < cells.length; j++) {
        cells[j] = cells[j]
          .replace(/\\\\.*$/, "")
          .replace(/\\hline/g, "")
          .trim();
      }

      // 행 생성
      if (cells.length > 0) {
        content += "<tr>";
        for (let j = 0; j < cells.length; j++) {
          if (isHeader) {
            content += `<th>${cells[j]}</th>`;
          } else {
            content += `<td>${cells[j]}</td>`;
          }
        }
        content += "</tr>";
      }
    }
    // 일반 텍스트
    else if (inDocument && line.length > 0 && !line.startsWith("%")) {
      if (inAbstract) {
        abstract += line + " ";
      } else if (
        !inFigure &&
        !inTable &&
        !inEnumerate &&
        !inItemize &&
        !inTabular
      ) {
        let processedLine = line;

        // \href 처리
        const hrefRegex = /\\href\{([^}]*)\}\{([^}]*)\}/g;
        processedLine = processedLine.replace(
          hrefRegex,
          '<a href="$1" target="_blank">$2</a>'
        );

        // \url 처리
        const urlRegex = /\\url\{([^}]*)\}/g;
        processedLine = processedLine.replace(
          urlRegex,
          '<a href="$1" target="_blank">$1</a>'
        );

        // \ref 처리
        const refRegex = /\\ref\{([^}]*)\}/g;
        processedLine = processedLine.replace(refRegex, "1"); // 간단히 1로 대체

        // \cite 처리
        const citeRegex = /\\cite\{([^}]*)\}/g;
        let citeMatch;
        while ((citeMatch = citeRegex.exec(processedLine)) !== null) {
          const keys = citeMatch[1].split(",").map((key) => key.trim());
          let replacement = "";

          keys.forEach((key) => {
            // 인용 목록에 추가 (중복 방지)
            if (!citationsInDocument.includes(key)) {
              citationsInDocument.push(key);
            }

            // 인용 번호 찾기
            const citeIndex = citationsInDocument.indexOf(key);

            // 인용 링크 생성
            const ref = references.find((r) => r.id === key);
            if (ref) {
              replacement += `<a href="#ref-${key}" class="citation-link" data-key="${key}" title="${ref.title} (${ref.author}, ${ref.year})">[${citeIndex}]</a>`;
            } else {
              replacement += `[${citeIndex}]`;
            }
          });

          processedLine = processedLine.replace(citeMatch[0], replacement);
        }

        // \LaTeX 처리
        const latexRegex = /\\LaTeX\{\}/g;
        processedLine = processedLine.replace(latexRegex, "LaTeX");

        // 인라인 수식 처리: $...$
        // 개선: 텍스트와 수식을 분리하여 각각 <span> 또는 <div>로 출력
        let lineParts = [];
        let lastIndex = 0;
        // 인라인 수식 ($...$)
        const inlineMathRegex = /\$([^\$]+)\$/g;
        let match;
        while ((match = inlineMathRegex.exec(processedLine)) !== null) {
          if (match.index > lastIndex) {
            lineParts.push({
              type: "text",
              value: processedLine.slice(lastIndex, match.index),
            });
          }
          lineParts.push({
            type: "math-inline",
            value: match[1],
          });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < processedLine.length) {
          lineParts.push({
            type: "text",
            value: processedLine.slice(lastIndex),
          });
        }
        // 만약 수식이 없으면 기존처럼 처리
        if (lineParts.length === 0) {
          content += `<p>${processedLine}</p>`;
        } else {
          lineParts.forEach((part) => {
            if (part.type === "text") {
              // 텍스트는 <p>로 감싸서 출력
              if (part.value.trim() !== "") {
                content += `<p>${part.value}</p>`;
              }
            } else if (part.type === "math-inline") {
              // 2차원 수식 표현: display 스타일로 렌더링 (블록 수식)
              content += `<div class="math-block">\\[${part.value}\\]</div>`;
            }
          });
        }
      }
    }
  }

  // 초록 내용이 있으면 추가
  if (abstract) {
    if (
      content.includes(
        '<div class="abstract"><div class="abstract-title">Abstract</div></div>'
      )
    ) {
      content = content.replace(
        '<div class="abstract"><div class="abstract-title">Abstract</div></div>',
        `<div class="abstract"><div class="abstract-title">Abstract</div>${abstract}</div>`
      );
    } else if (!content.includes(abstract)) {
      // If abstract content not found in the HTML but exists
      const titleIndex = content.indexOf(
        '<div class="abstract"><div class="abstract-title">Abstract</div>'
      );
      if (titleIndex > -1) {
        const insertIndex =
          titleIndex +
          '<div class="abstract"><div class="abstract-title">Abstract</div>'
            .length;
        content =
          content.substring(0, insertIndex) +
          abstract +
          content.substring(insertIndex);
      }
    }
  }

  // 참고 문헌 섹션 추가
  if (content.includes("\\References{sample}")) {
    let referencesSection = `<h2 class="section">References</h2><div class="references-list">`;

    // 모든 references를 순서대로 출력
    references.forEach((ref, index) => {
      let refHtml = `<div class="reference-item" id="ref-${ref.id}">`;
      refHtml += `<span class="reference-number">[${index + 1}]</span> `;
      refHtml += `<span class="reference-text">`;
      refHtml += `${ref.author}, "${ref.title}", `;

      if (ref.journal) {
        refHtml += `<em>${ref.journal}</em>, `;
        if (ref.volume) refHtml += `vol. ${ref.volume}, `;
        if (ref.number) refHtml += `no. ${ref.number}, `;
        if (ref.pages) refHtml += `pp. ${ref.pages}, `;
      } else if (ref.publisher) {
        refHtml += `<em>${ref.publisher}</em>, `;
      }

      refHtml += `${ref.year}.`;
      refHtml += `</span>`;
      refHtml += `</div>`;

      referencesSection += refHtml;
    });

    referencesSection += `</div>`;

    // 참고 문헌 섹션 추가
    content = content.replace(/\\References\{sample\}/g, referencesSection);
  }

  return content;
}

// 표(tabular) 환경을 HTML로 변환
function renderLatexTable(tableLines) {
  let html = "<table>";
  let headerDone = false;
  for (let line of tableLines) {
    if (!line.trim()) continue;
    // \hline은 무시
    if (line.includes("\\hline")) continue;
    // 행 분리
    let row = line.replace(/\\\\$/, "").trim();
    let cells = row.split("&").map((cell) => cell.trim());
    html += "<tr>";
    for (let cell of cells) {
      // \textbf{...}를 <b>...</b>로 변환
      cell = cell.replace(/\\textbf\{([^}]*)\}/g, "<b>$1</b>");
      if (!headerDone) {
        html += `<th>${cell}</th>`;
      } else {
        html += `<td>${cell}</td>`;
      }
    }
    html += "</tr>";
    headerDone = true;
  }
  html += "</table>";
  return html;
}

// 파일 클릭 이벤트 처리
function handleFileClick(event) {
  // 파일 항목 클릭 시
  const fileItems = document.querySelectorAll(".file-item");
  fileItems.forEach((item) => {
    item.classList.remove("active");
  });

  // 클릭한 항목 활성화
  const clickedItem = event.currentTarget;
  clickedItem.classList.add("active");
}

// 페이지 로드 시 초기화
// 참조 관련 변수와 함수들

// 인용 링크 클릭 이벤트 핸들러
function handleCitationClick(event) {
  // Since we're using normal anchor links now, just add highlighting behavior
  if (event.target.classList.contains("citation-link")) {
    const key = event.target.getAttribute("data-key");
    const refElement = document.getElementById(`ref-${key}`);

    if (refElement) {
      // Add a delay to allow the browser's default scroll to complete
      setTimeout(() => {
        // 강조 효과
        refElement.classList.add("highlight");
        setTimeout(() => {
          refElement.classList.remove("highlight");
        }, 2000);
      }, 100);
    }
  }
}

window.onload = function () {
  // LaTeX 소스 코드
  latexSource = `\\documentclass{article}
    % Language setting
    % Replace \`english' with e.g. \`spanish' to change the document language
    \\usepackage[english]{babel}

    % Set page size and margins
    % Replace \`letterpaper' with \`a4paper' for UK/EU standard size
    \\usepackage[letterpaper,top=2cm,bottom=2cm,left=3cm,right=3cm,marginparwidth=1.75cm]{geometry}

    % Useful packages
    \\usepackage{amsmath}
    \\usepackage{graphicx}
    \\usepackage[colorlinks=true, allcolors=blue]{hyperref}

    \\title{FlexiVol: a Volumetric Display with an Elastic Diffuser to Enable Reach-Through Interaction}
    \\author{Authors: Elodie Bouzbib, Iosune Sarasate, Unai Javier Fernández, Ivan Fernández, Manuel Lopez-Amo, Iñigo Ezcurdia, Asier Marzo}

    \\begin{document}
    \\maketitle

    \\begin{abstract}
    Volumetric displays render true 3D graphics without forcing users to wear headsets or glasses. However, the optical diffusers that volumetric displays employ are rigid and thus do not allow for direct interaction. FlexiVol employs elastic diffusers to allow users to reach inside the display volume to have direct interaction with true 3D content. We explored various diffuser materials in terms of visual and mechanical properties. We correct the distortions of the volumetric graphics projected on elastic oscillating diffusers and propose a design space for FlexiVol, enabling various gestures and actions through direct interaction techniques. A user study suggests that selection, docking and tracing tasks can be performed faster and more precisely using direct interaction when compared to indirect interaction with a 3D mouse. Finally, applications such as a virtual pet or landscape edition highlight the advantages of a volumetric display that supports direct interaction.
    \\end{abstract}

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{Figure1.png}
    \\caption{\\label{Figure 1}\FlexiVol is a     [[[[[[[[[[[[[[[ 문제1 ]]]]]]]]]]]]]]]           with an elastic diffuser that allows users to reach inside and interact directly with true 3D graphics. A) The user’s hand and the virtual objects have coherent focal accommodation: 1. the view is focused at the hand and red cube, or 2. at the sphere behind them. B) The user input (hand) is aligned with the output (rendered objects), allowing to directly 1. grab virtual objects, 2. to translate and 3. rotate them.}
    \\end{figure}

    \\section{Introduction}

    We are used to view and interact in a 3D world. Our vision uses cues to interpret the space, and with our hands we directly grab and manipulate the objects within.
    Graphics rendered on a 2D screen can provide monocular visual cues such as occlusion, distance-size relationship, shadows or texture gradients [16] but binocular disparity, accommodation of the focal point or convergence cannot be displayed. Differently, a true 3D display [30] renders graphics that can be viewed by multiple people from different angles and provide those visual cues; also, they do not force the users to wear any device.
    Direct interaction is a “natural" way of interacting with virtual entities in which the output space (rendered graphics) is aligned with the input space (interaction area) [21] – similar to our interactions with the real world objects [6]. This type of interaction is widely employed in multi-touch flat screens: we directly press on the buttons with the finger, drag icons to move them, or rotate an object with two fingers as we would do to rotate a sheet of paper in real life.
    Volumetric displays render true 3D and can provide most of the visual cues that we perceive from the real world. However, with current technologies, users cannot reach inside the display volume to directly interact with virtual objects as they would do in real life. Their diffusers are most often rigid, which causes safety hazards when reaching through; and interaction techniques are thus performed indirectly using a 3D mouse or a keyboard.
    FlexiVol’s concept is based on modifying volumetric displays with an elastic optical diffuser to enable users to insert their hand within the rendering volume and directly interact with spatially overlapped true 3D graphics. The true 3D graphics and user hand provide coherent focus accommodation (Figure 1.A), which allows for enhanced depth perception. The interaction with the rendered graphics is direct, the user can grab an object to move and rotate it (Figure 1.B).
    We demonstrate FlexiVol’s concept in a modified commercially available volumetric display (Voxon VX1) and in custom-made volumetric displays. We studied different candidates for the diffuser material, and proposed parameters to guide their selection as elastic diffusers: elastic properties, optical diffusion, frequency response and amplitude. We also proposed a simple method to correct the visual distortion introduced by the oscillating elastic diffuser.
    Inspired by interactions with 2D elastic diffusers [57], we propose a design space of interaction techniques for elastic diffusers in 3D volumetric displays, through users gestures and actions within FlexiVol. We then conducted a user study (n = 18), consisting of three tasks (Selection, Tracing, Docking) to validate FlexiVol and compare the reach-through input modality with a 3D mouse, a common input modality for current volumetric displays.
    We show that (1) reach-through interaction techniques significantly improve completion time, (2) self-assessed performance and (3) cognitive workload; (4) as a trade-off with accuracy. Qualitative feedback also (5) indicates how reaching-through FlexiVol to select and manipulate 3D objects may initially seem intimidating or bothersome, but users quickly discover the interaction to be safe and surprisingly gentle to the touch.

    The contributions of this paper are:

    \\begin{itemize}
    \\item FlexiVol, a novel concept of using elastic diffusers for volumetric displays,
    \\item Guidelines for characterizing and selecting elastic diffusers for volumetric displays,
    \\item A compatible design space for reach-through interaction techniques,
    \\item Empirical results of completion time, accuracy and precision and mental workload comparing reach-through interaction with a 3D mouse,
    \\Proposed applications using FlexiVol.
    \\end{itemize}

    \\section{Related Work}
    In a true 3D display [30], graphics can be observed by multiple people from different points of view, without forcing them to wear any device, and with the depth visual cues that we get from the real world.
    Head-Mounted-Displays (HMDs) provide depth cues by showing different images to each eye thus creating binocular disparity but they usually do not provide convergence and focus accommodation [52], thus users cannot focus correctly at their hands and nearby objects. State of the art HMDs are exploring eye-tracking [2] or holographic near-field displays [36, 41] to support convergence or focal accommodation. However, even if those technologies get fully developed, each user still has to wear a head-mounted display, hindering the come and interact paradigm where one or various users just approach a system and start using it.
    From the different 3D technologies, only volumetric displays and holograms provide all the depth cues [47]. A volumetric display [19] emits points of light from each position within a volume, this technology is superior to holograms which present problems such as clipping and forbidden geometries [53].
    Volumetric displays have been classified as: swept, solid and free-space [54]. Swept volumetric displays [51] exploit the persistence of vision to render different fractions of a 3D scene at different positions, so that they are perceived as a single three-dimensional scene [3, 28]. They use high-speed moving rigid parts which can be dangerous to touch. Solid displays use non-linear optical media that emits light when illuminated by two different wavelengths coming from perpendicular directions [42], or two-photon absorption [35]. Free-space display examples include plasma induced in mid-air using a powerful focused laser [50]; they involve severe dangers. Other free-space volumetric displays use levitated tracer particles trapped with optical [53] or acoustic tweezers [15, 22].
    In those volumetric displays, the user cannot insert the hand: it can damage the user or the display, and it is not physically possible to touch a solid cube or the levitation stops working. In other words, these existing true 3D displays do not allow the users to reach inside the display volume to directly interact with the rendered objects, removing the possibility to combine true 3D graphics with direct interaction. Plasma induced from lasers can be made touchable by femtosecond pulsing [40] or optically redirecting the graphics using parabolic mirrors [32]; however, these alternatives are dangerous to the eye and only produce rendering volumes below 2 cm.

    Several interaction techniques have been developed for 3D environments [10, 26], but mostly indirect approaches have been adapted for volumetric displays [17] such as rays [13] or cursors. Other alternatives use hand gestures [4] or the index finger as a pointing device [18]. Methods based on touching the display boundary (i.e., protective case) [29] try to get closer to the display volume, yet the interaction remains indirect.
    Commercial volumetric displays such as the Voxon VX1 [44] use traditional mouse and keyboard techniques, or 3D mice [1] as an input modality. Voxon displays also support a hand-tracking device (Leap Motion, Ultraleap Ltd.) enabling the use of the hands to manipulate virtual objects, but the real hands have to remain outside of the display volume.
    In this paper, we investigate how to enable reach-through interactions to facilitate the selection and manipulation of true 3D content inspired from the definition of direct interaction from [21]: allowing the user to literally get their hands into the virtual display and to directly interact with a spatially aligned 3D virtual world. We propose the use of non-rigid diffusers on swept volumetric displays to enable the user to reach inside the display volume.

    Fog screens enable users to pass their hands through 2D projection screens [45]. Shape-changing fog-screens [56] can provide a 2.5D surface for projection but the control points of the surface are constrained (5 control points along the vertical direction; i.e., 1D) and volumetric graphics are not possible. A matrix of 6 × 6 fog emitters allows flat projections to appear at discrete positions [33]. Water droplets can also form a projection screen, allowing to stack up to 3 droplet screens at different depths [5]. A 2D array of falling droplets can act as a diffuser for volumetric graphics [11]; however, the rendered graphics were spheres or cubes occupying the whole display due to limited resolution along the falling direction. None of these approaches provide continuous volumetric graphics or with enough resolution to study direct interaction techniques. Furthermore, no user study or exploration of the direct interaction capabilities was conducted. HoloDust [43] is a theoretical concept that projects in falling dust taking into account its particle distribution to render true 3d graphics, but was never implemented.
    An alternative to obtain continuous graphics with direct interaction, is to replace a solid diffuser (e.g., tablet screen) by an elastic one (e.g., a fabric) to enable new interaction techniques such as pushing or pinching it [8, 31, 39, 49, 58, 59]. However, these displays only have 2D or limited 2.5D [9] rendering capabilities. In this paper, we draw inspiration from the use of elastic diffusers and their taxonomy of interaction techniques [57] to enable novel interaction techniques within a volumetric display with elastic diffusers.

    \\section{Swept Volumetric Display System Design}

    We relied on three different mechanisms to realize and explore FlexiVol’s concept. A modified commercially available swept volumetric display (Voxon VX1) (Figure 2 - C) and two custom-made devices for our technical explorations (Figure 2 - A,B) that enabled us to control parameters such as oscillation frequency and amplitude as well as projection patterns. These mechanisms rely on the same principle, described in this section. A screenshot of a custom-made swept volumetric display is available in Appendix A.1; and files for replication are available here .
    Swept volumetric displays render true 3D content by sweeping a 2D surface, its “diffuser", at high speed. The graphics are projected upon this surface, as 2D slices, for each position of the diffuser a different slice is projected, persistence of vision makes the users perceive it as a 3D volume (see Figure 3). The diffuser usually oscillates following a sinusoid, the oscillation is generated by one or more actuators (such as a voicecoils) and its displacement can be amplified by a mechanical amplifier (e.g., planar spring).

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure2.png}
    \\caption{\\label{Figure 2} (A, B, C) Schematics of three swept volumetric displays with elastic diffusers. D) Actuators input signal, frame oscillation, and diffuser movement.}
    \\end{figure}

    Projector: A high frame rate is needed to render into the display volume: if 100 slices are projected at a frame rate of 30 Hz, the projector has to operate at 3000 Hz. Usually, DLP projectors with time multiplexation for the color are employed. The projected images are reduced to binary patterns and thus the original frame rate of the projector can be multiplied by the number of color bitplanes. For example, the Voxon VX1 projects 192 slices at 15 Hz (2880 Hz) with a resolution of 980 × 720px. In our custom-made volumetric display with one actuator (see Figure 2 - A or Appendix A.1), we used a DLP LightCrafter 4500. When operating at 120 Hz with 24-bit color depth, it projects binary patterns at 2880 Hz with a resolution of of up to 1280 × 800px. Color volumetric rendering is possible by losing depth resolution and multiplexing in space the color (e.g, odd slices are projected blue whereas even slices are red).
    Actuators: the typical actuators for a planar oscillating SVD are voicecoils (e.g., Voxon VX1 [44] and Dan Maloney’s [37]) either custom designed or from a modified speaker. The VVD [24] uses stepper motors that rotate back and forth 25° as an alternative. In our custom-made volumetric displays (see Figure 2 - A,B), we employed a modified VDSSP6.5/8 HQ Power speaker.
    Mechanical amplifier: the actuators may not oscillate with sufficient amplitude for the diffuser to provide a large enough display volume. That is why some designs (e.g., Voxon VX1 and Dan Maloney’s) use mechanical amplifiers. A mechanical amplifier can be just a spring or a lever mechanism. In our custom-made one actuator volumetric display (see Figure 2 - A), we connected the speaker to an audio amplifier (Fosi Audio TP-02); and used a mechanical PLA 3D-printed spring (3 mm thickness, 70 mm diameter, 3 spirals). The design with two-actuators does not use mechanical amplifiers to only study the mechanical behaviour of the diffusers.
    Diffuser: it is     [[[[[[[[[[[[[[[ 문제2 ]]]]]]]]]]]]]]]          , which receives the projected light and diffuses it towards the viewers. The display volume is usually protected with an acrylic case to avoid users touching the solid diffuser. For FlexiVol, we replaced this traditional solid diffuser with an array of elastic strips (see Section 4).

    Rendering Rendering for a volumetric display is different from typical scanline or ray tracing pipelines. The scene needs to be sliced along planes, those slices are projected at high-speed on the oscillating diffuser (see Figure 3). Therefore, several slices are combined into a color image to be sent to the projector. For example, 24 slices with binary color are packed into a regular 24-bit RGB image that the projector is expecting from the HDMI or Display Port input.
    If the 3D scene is defined as voxels, either from a 3D-array or a function, the rendering is simplified since each pixel from the slice can be directly obtained from the corresponding voxel.
    If the application uses typical meshes with vertices and triangles, the rendering of the slices is not trivial. Slicing algorithms for hollow rendering use a fragment shader that renders pixels as pure white if its 3D position is between the sliced depth or otherwise get discarded. For solid rendering of the meshes, the z-clipping minimum value is set to the slice depth and only the back-facing triangles are rendered in pure white so that they fill in the cutout of that object.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure3.png}
    \\caption{\\label{Figure 3} Rendering in a swept volumetric display. The actuators are excited with a sinusoidal signal; the projector is synchronized with this input to project different slices at specific positions of the sweeping diffuser. The slices are a cross-section of the 3D object; that, at high speed oscillation, are perceived as a whole volume.}
    \\end{figure}

    Synchronization In general, even if the actuators are excited with the same frequency as the projector, there will be drift and synchronization is required (see Figure 3 - the slices of the 3D object are overlaid over the sinusoid of the actuators input).
    If the actuator signal is used to synchronize the display, the rendering system has to sample the actuation signal before the start of each frame. That is, the rendering system checks the phase of the actuation signal and extrapolates the diffuser position for the next 24 slices, renders the slices and sends them packed as a color image to the projector.
    If the projector is the synchronization source, the vertical sync signal can be used to keep in a phased-locked-loop the actuation signal. The actuation signal is required to be a divider of the vsync signal. For example, in the Voxon VX1 the actuation signal is a 15 Hz sinusoidal and the vsync of the projector is a 120 Hz signal.

    \\section{Elastic Diffusers}
         [[[[[[[[[[[[[[[ 문제3 ]]]]]]]]]]]]]]]          by an elastic material that allows for deformations without harming the user or damaging the display. The most common used materials for elastic projection screens are Lycra and latex [57], we thus used these materials as a starting point but also characterized others.
    For the diffuser, we decided to use an array of strips rather than a continuous membrane because when the user pushes the membrane, it creates deformations along all the membrane and distorts the entire display volume; with the strips, only the pushed ones get distorted. Furthermore, the forces that a membrane exerts on the user’s finger or the mechanical amplifiers can damage them, especially for anisotropic materials that have a large stiffness along their non-elastic dimension. Finally, the deformation of an oscillating 2D membrane is not as predictable as a single strip, the latter can just be approximated with a sinusoid or parabole (see Section 5). We employed strips of 20 mm width to approximately match the finger width; smaller strips had the same distortion upon user contact, produced more optical discontinuities and the arrays were more cumbersome to adjust. Larger strips tended to have the same issues as a full membrane: too much force and distorted area upon contact with the hand.
    All the fabrics were laser-cut into 200 × 20 mm2 strips along their elastic dimension. The curable materials (e.g., silicone) were cured on top of an acrylic sheet with a spacer of the desired thickness.
    The selected materials samples can be seen in Figure 4 and are:
    Elastane also called Lycra, Spandex or Dorlastan is a synthetic fiber (polyether-polyurea copolymer). We used fabrics of thicknesses 0.8 mm (elastane A), 0.5 mm (elastane B) and 0.8 mm with a 20% polyester (elastane C) - Figure 4 - 1 to 3.
    Silicone we used (Silicone RPRO Glass, Reschimica) and cured them in sheets of thickness 0.8 mm - Figure 4 - 4.
    Elastic band we used an elastic band typically used for clothes, for example along the waist of stretchable trousers. We picked a composition of 60% polyester and 40% elastane with a thickness of 1.0 mm - Figure 4 - 5.
    Projection screen commercial fabric used for projection screens (120" double side, Osoeri) made of polyester and a thickness of 0.5 mm - Figure 4 - 6.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure4.png}
    \\caption{\\label{Figure 4} Left) Strip samples. Right) Strips oscillating (15 Hz).}
    \\end{figure}

    Discarded materials: Organza, silk and other fabrics were too stiff, they applied too much force on the user finger and display. Latex (latex pro, prevulcanized, Reschimica) was also tested in 0.7 mm sheets but it offered no advantages compared to silicone [34].
    We tried a composite material by infusing the projection screen with silicone, trying to obtain the visual quality of the former and elastic properties of the latter. However, the resulting strip was too stiff and prone to detachment between its components. There are fabrics specifically designed for back-projection but we found them to have too much stiffness and density.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure5.png}
    \\caption{\\label{Figure 5} Optical projection on the selected materials. A.Left) Back-projected patterns (RGB stripes, a black and white grid, and white light). A. Zenithal photographs with the strips at their original length of 185 mm (Middle) and stretched to 235 mm (Right). B) Red, green and blue average Savitzky-Golay filtered intensities at different offset angles from the central projection axis.}
    \\end{figure}
  
    4.1 Optical diffusion
    To assess the optical diffusing properties of the strips, we employed a back-projection setup to project test images on the selected samples. These projections were performed with the samples in both unstretched and stretched states.
    Images were captured using a Sony Alpha 6300 camera equipped with a Sony E PZ 16-50 mm F3.5-5.6 OSS lens, positioned 30 cm above the samples in a dark environment. The camera settings were: zoom at 21 mm, shutter speed 1/30 s, aperture F8.0, metering mode Multi-segment (M-M) with a value of 1.3, and ISO 100. An EZCast Beam J2 projector (native 854x480 resolution, 300 lumens, contrast 5000:1) was positioned 30 cm below the samples.
    Test patterns, including blank white light, a grid on a black background, and RGB stripes, were projected to assess brightness, sharpness, color accuracy, or distortion. All patterns were projected at three elongations: the original length of 185 mm, a stretched length of 210 mm, and a maximum stretched length of 235 mm. Figure 5 presents results only for the original and maximum stretched lengths (185 mm and 235 mm, respectively) for clarity.
    We chose a maximum elongation of 50 mm (from 185 to 235 mm) as it approximates the maximum elongation caused by the finger pushing down the strip center on a display volume of 190 × 190 × 80 mm3. This also avoids irreversible plastic deformations on the samples (see Section 4.4).
    A qualitative analysis of Figure 5.A (and Appendix A.2) reveals that, as expected, the Projection Screen provides even light diffusion, while Silicone exhibits a prominent central flare. Elastane B exhibits diffusion comparable to Projection Screen. Dark artifacts due to their weaving pattern are observed in Elastane A, Elastane C, and particularly in Elastic Band samples.
    Inspection of the B&W grid pattern and the RGB stripes pattern reveals that Elastane B and Elastane C distort the projected graphics when they are stretched. In contrast, Silicone displays sharp and well-defined lines; however, the aforementioned glare significantly impacts certain areas, causing overexposure. The Elastic Band does not distort the graphics upon stretching, yet straight lines aligned with the thread direction may be prone to artifacts.
    Figure 5.B presents red, green and blue intensities at different offset angles from the central projection axis for Silicone, Elastic Band and Projection Screen materials (comparative graphs for all materials at both original and stretched lengths are available in Appendix A.2).
    We note that Silicone produces a bleached final image. In contrast, Elastic Band shows a more consistent behaviour across its surface; similarly to the traditional projection Screen. However, the Elastic Band affects the projection with dark stripes along its thread orientation while other materials, such as the Projection Screen or Elastane A, maintain uniform color.
    4.2 Stiffness
    We measured the transversal stiffness of the samples. That is, the force that the material exerts upwards as it is pushed down along its center. A 3D printer (Ender 3 Pro) was modified by substituting the hot-end with a load cell (1 kG HALJIA with an HX711 ADC). The samples were mounted on a frame on top of the printer bed and the load cell pressed down the strip. A computer controlled the printer with g-code and read the force-weight at each displacement position. The setup and results are shown in Figure 6.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure6.png}
    \\caption{\\label{Figure 6} A. Setup for measuring     [[[[[[[[[[[[[[[ 문제4 ]]]]]]]]]]]]]]]          stiffness: A 3D printer positions a load cell to deform the sample. B. Transversal stiffness of the samples.}
    \\end{figure}

    Frequency Response
    We experimentally captured the frequency response of the strips. The oscillation amplitude at the center of the strip was measured for different frequencies of the excitation signal, ranging from 10 Hz to 30 Hz. We used a custom-made mechanism (shown in Figure 2 - B). We set the settling time between frequencies at 200 ms, and captured 200 frames at 25 FPS with a LOETAD 1080P HD Webcam. Strobe illumination was used at +0.5Hz from the excitation signal to allow the capture of the oscillation at a regular frame rate, since our available high-speed cameras were not able to store the whole frequency sweeping process, this setup allowed to capture phase as well as amplitude and to observe the shape dynamics of the strip. The setup and results can be seen in Figure 7.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure7.png}
    \\caption{\\label{Figure 7} Frequency response characterization. A) Setup for measuring frequency response. B) Strobe illumination fired when the sample is at the top displacement. C) Relative deformation of the different samples (in %) as a function of excitation frequency (in Hz).}
    \\end{figure}

    We then compare the experimental frequency response with predicted natural frequencies in Table 1. The natural frequency for a strip in the first mode can be estimated as:

    \\[𝑓=1/2⁢𝐿⁢√𝑇/𝜇  (1)\\]

    where L is the strip length, T the longitudinal tension and μ the linear density. We note that this approximation is adequate for small vibrations; however, for larger vibrations and elongations, more sophisticated models may be required [46]. There is a small discrepancy between measured and predicted natural frequencies that we attribute to the different clamps used in each setup and the permanent deformation that some samples may have undergone. In any case, it is possible to use the predicted values from Equation 1 as a reference for the resonant frequency of a strip for a given elongation (stretching).

    \\begin{table}[h]
    \\centering
    \\caption{Frequency response of the elastic diffusers. The resonance frequency is the frequency at which the strip oscillates with maximum amplitude. The damping ratio is a measure of how quickly the oscillations decay, and the natural frequency is the frequency at which the strip would oscillate if it were not damped. The difference between measured and predicted natural frequencies is also shown.}
    \\begin{tabular}{|l|c|c|c|c|c|c|c|}
    \\hline
    Sample & Length at rest (± 1mm) & Length at measurement (± 1mm) & Resonance Frequency (Hz) & Damping Ratio (± 0.01) & Natural Frequency measured (Hz) & Natural Frequency predicted (Hz) & Difference Frequency measured vs. predicted \\
    \\hline
    Elastane A & 165 & 185 & 25.5 ± 0.5 & 0.118 & 25.9 ± 0.6 & 23.2 ± 0.3 & 2.7 \\
    Elastane B & 168 & 185 & 28.0 ± 0.5 & 0.116 & 28.4 ± 0.5 & 26.7 ± 0.4 & 1.7 \\
    Elastane C & 175 & 185 & 14 ± 0.5 & 0.107 & 14.2 ± 0.5 & 14.4 ± 0.2 & 0.2 \\
    Silicone & 171 & 180 & 18.0 ± 0.5 & 0.083 & 18.1 ± 0.5 & 16.6 ± 0.3 & 1.5 \\
    Band & 170 & 171 & 21.5 ± 0.5 & 0.105 & 21.7 ± 0.5 & 22.8 ± 0.7 & 1.1 \\
    Screen & 160 & 183 & 27.5 ± 0.5 & 0.127 & 28.0 ± 0.6 & 23.9 ± 0.4 & 4.1 \\
    \\hline
    \\end{tabular}
    \\end{table}

    Plastic Deformations
    Materials can have an elastic deformation, meaning that they will recover their shape and mechanical characteristics. However, beyond a certain elongation, they will suffer plastic deformations (or even breakage), meaning that they do not recover their original shape and mechanical properties.
    The samples were subject to longitudinal stretching and relaxing 2 times while their force was measured, resetting the initial length after the first cycle. The permanent deformation and hysteresis can be seen in the offset between the initial and final point of each cycle in the elongation axis. The Elastic band (Figure 8 - Elastic Band) and Silicone were robust and their stiffness did not change significantly during the process. On the contrary, Elastanes and Projection Screen (Figure 8 - Projection Screen) suffered significant hysteresis; that would eventually lead to permanent deformation and even breakage (as seen in the discontinuities in Figure 6 - B).
    The larger the plastic deformation, the more likely the end holes of the strips extend or break.     [[[[[[[[[[[[[[[ 문제5 ]]]]]]]]]]]]]]]          , in our setups, the holes were used to align the strips and set their length, and a clamping mechanism was used to avoid their deformation.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure8.png}
    \\caption{\\label{figure 8} Stiffness of elastic band (blue dashed) and projection screen (purple dotted) as they are stretched and relaxed twice.}
    \\end{figure}

         [[[[[[[[[[[[[[[ 문제6 ]]]]]]]]]]]]]]]             
    A good material for a FlexiVol diffuser should have the following characteristics:
    Visual quality. It should provide an even diffusion of the light along the viewing angles but without blurring too much the patterns or attenuating them. The backprojected image should not distort when the material is stretched, otherwise the volumetric graphics will look blurry at the top and bottom.
    Stiffness. The force should not exceed 8 N when the material is stretched 80 mm – which is our maximum display volume height. Larger forces can damage the mechanical amplifiers and were found disturbing for the user. The selected samples fulfil this criteria, other materials were discarded given that they were too stiff and generated too much force on the user finger being unpleasant or even painful to touch when they were oscillating.
    Frequency response. It may not be desirable to have the diffuser strip resonating at the operating frequency of the display because it would lead to larger forces on the display and large amplitudes provoking graphic distortions, harder to correct (see Section 5).
    Plastic Deformation. It should have elastic deformation up to the elongation range. That is, the deformations should not be permanent since that would make the strips hang and give them different amplitudes when oscillating, thus incurring in discontinuous graphics in the rendering volume.
    Given those criteria, we selected the elastic bands because they retain their mechanical and optical properties during elongations. Their visual quality is not the best since it has dark stripes along them, but when oscillating in a volumetric display that was not a significant problem. Elastane or the projection screen offered the best visual quality, yet they were permanently deformed even with small elongations and tend to have a natural frequency close to the operating frequency of the display, leading to large distortions. Silicone was elastic along the desired range but it did not diffuse light correctly. Adding ink or scattering particles to the mixture could improve its optical qualities; but in any case, its mechanical properties are not adequate since it is prone to rotate and not laying flat when oscillating – being an isotropic material in terms of stiffness.
    The elastic bands were highly anisotropic; that is, they were elastic along their length but stiff on the other direction. This made them lay flat when oscillating on the display, passing around the finger but recovering their horizontal orientation when the finger was removed.
    4.6 SVD Noise with Elastic Diffusers
    We measured the noise levels using both the original rigid diffuser and the chosen elastic material (elastic band) on the Voxon V1 as a reference; and with and without the hand inside the display volume. Noise levels were captured 5 times using a Meterk MK09 with the sonometer’s tip at 60 cm from the center of the display volume, which is the typical distance between the display and the user’s ear. The noise level was 57.9 dB (std = 0.2) for the rigid diffuser (without safety dome) and 51.9 dB (std = 0.2) for the elastic diffuser. Inserting the hand inside the volume sligthly increased the noise level 53.0 dB (std = 0.3). Noise can be considered a relatively small issue and the noise levels actually decrease slightly by using an elastic diffuser.

    \\section{Distortion Correction}

    The diffuser has to be elastic so that it deforms upon user’s contact and does not damage their hand or the display. However, this same desired property makes the elastic diffuser become non-planar when it oscillates and thus the projected graphics look distorted (Figure 9).

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure9.png}
    \\caption{\\label{figure 9} Projection on a swept volumetric display. A) in a flat rigid diffuser, the cube is rendered correctly. B) the same projection on an elastic diffuser, renders the cube distorted.}
    \\end{figure}

    Since the oscillation of the diffuser has a periodic motion, the shape of a planar diffuser and an elastic diffuser can be predicted at each timestamp. The inverse transformation from the elastic to the rigid diffuser can be applied vertex-wise to the rendered meshes to correct the distortion.
    We assume that the deformation occurs only along the Z-axis (along the projection direction, i.e, top-bottom). Deformations along the Y-axis (back-forth) occur on a membrane diffuser which is continuous along the XY plane, but not significantly on individual strips (aligned along the X direction). Deformations along the X direction (left-right) occur on the strip physical material but not on the positions of the projected graphics.
    We also assume that the shape of the elastic diffuser can be approximated as a sinusoid along the X direction as it oscillates. To simplify the fitting, we employed a parabole with 2 points at the sides of their holding frame and a central point at the center of the strip. Figure 10 shows the elastic diffuser at 3 different positions and their matching paraboles.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure10.png}
    \\caption{\\label{figure 10} Top) Strips oscillating in the volumetric display. Left to right shows 3 different moments. Bottom) a parabole was fitted to the first strip.}
    \\end{figure}

    We recorded the oscillating diffuser at 900 FPS with a Phantom MIRO-C211-8GB-M high speed camera for at least half a period of oscillation. For each captured frame, starting from the highest point of the frame to the lowest, a parabole was fitted to the strip. We processed only the descent of the diffuser to avoid the ambiguity of having 2 paraboles for each height. The correction was a fitted degree 6 polynomial

    \\[ℎ⁢𝑒⁢𝑖⁢𝑔⁢ℎ⁢𝑡=𝐹⁡(𝑋,𝑍)\\]

    which     [[[[[[[[[[[[[[[ 문제7 ]]]]]]]]]]]]]]]          an X and Z position checks which parabole passes through that point and returns the height of the holding frame (Z of the frame). By applying this polynomial to the vertices of the meshes to be rendered, the distortion was significantly corrected. The effect of the distortion correction is shown in Figure 11. The display volume increases given the fabric deformation, but when using the correction, the effective volume remains the same as when using a rigid diffuser.

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure11.png}
    \\caption{\\label{figure 11} A calibration cube rendered on FlexiVol: left cube is uncorrected, right cube is corrected. A) viewed from the top-right corner. B) frontal view.}
    \\end{figure}

    \\section{Reach-Through Interaction Design Space}

    FlexiVol is designed to enable direct interaction, allowing the users’ hands to reach-through its elastic diffuser and interact with 3D content. In this section, we describe the interaction design space of FlexiVol, through Input and Interaction Techniques.
    We draw inspiration from user-defined gestures with 2D elastic displays [57], touchscreens and AR [60], as well as virtual reality [27] to enhance the existing interaction design spaces for volumetric displays [17].
    6.1 Input
    Input represent the physical interaction from the user, and is here described in two categories: the Interaction Space - e.g., the where within FlexiVol; and the Interaction Direction - e.g., transversal or lateral interaction within FlexiVol’s strips. We focus on users’ interaction with hands (one or multiple fingers).

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure12.png}
    \\caption{\\label{figure 12}Frames extracted from high speed recordings of direct interactions with FlexiVol. A) 1. Interaction with the diffuser strips; 2. between the diffuser strips. B) Pinching gesture used to grab, scale or rotate objects. C) A sliding gesture initiated at a corner and directed towards the center.}
    \\end{figure}

    6.1.1 Interaction Space.
    When the user hand reaches-through the display volume, it either collides with the diffuser strips, or passes between them.
    Interaction with the diffuser strips. The diffuser deforms under the input type constraints, but the applied deformation is local to the colliding strip (see Figure 12 - A1). Strips can be independently or simultaneously interacted with; without altering the other ones.
    Interaction between the diffuser strips. When interacting through the volume, the input type can also be moving between the diffuser strips (see Figure 12 - A2, B). In this case, the strips keep oscillating around the “obstacle".
    However, when the user performs an interaction technique, most often at least one strip will be touched, providing a tangible dimension to the interaction. Even though the user’s finger is between strips, if the finger moves, it will interact with a strip.
    Interacting between strips can also be performed, for instance if the user goes below the diffuser and opens its fingers. This is however not recommended as it would cause the diffuser to pass through an area without visual rendering, hindering the interaction with 3D content.
    Interaction with other diffuser types. We also tested interacting with a continuous diffuser (i.e., a membrane) instead of strips. This however causes the physical and visual deformations to be global over the whole surface; thus requiring more complex simulations of the surface deformation under the given number of contact points; as well as harder to calibrate distortion correction schemes. However, when used, the hand tracking does not suffer from the occlusion of the strips.
    We considered the interaction space as a function of strips width and spacing. The wider the strips, the closer it is to a membrane diffuser and harder to visually correct for deformation. We also tried strings and the visuals were good but the tactile feedback was similar to whipping the fingers, and was discarded. The wider the spacing between the strips, the less continuity there is in the visuals as the diffuser is not continuous. We also tested overlapping strips which resulted in worse visuals as the projection light had to project over two diffusers.
    6.1.2 Interaction Direction.
    The input over the diffuser can be performed in any direction. The strips are indeed placed along a single longitudinal direction, but interactions can also occur along the lateral or diagonal directions (see Figure 12 - C). A tactile discontinuity can be perceived between strips, but the user input type (e.g., finger, stylus) can perform continuous gestures without getting stuck between/under a strip. The high operating frequency of the volumetric displays moves the strips fast enough so that the input (e.g., finger, stylus) does not perceive their oscillation and the strips remain under the input type’s constraints. The strips oscillated with similar amplitude and phase, thus limiting potential entanglement with the use hand or between them.
    6.2 Interaction Techniques
    We selected the interaction techniques that are closer to real-life ones. Techniques that use metaphors such as rays, clutching with the thumb or micro-gestures were discarded since they are different from how we interact in the real world. In this section, we list the main user-gestures from FlexiVol’s design space, along with user actions. We illustrate the interaction techniques as combinations of actions and gestures (Figure 1 - B).

    \\begin{figure}
    \\centering
    \\includegraphics[width=0.25\\linewidth]{figure13.png}
    \\caption{\\label{figure 13}Reach-through direct interaction techniques for FlexiVol: Gestures and Actions}
    \\end{figure}

    6.2.1 Actions.
    We represent the main reach-through     [[[[[[[[[[[[[[[ 문제8 ]]]]]]]]]]]]]]]          users could perform in FlexiVol in Figure 13 - Actions), group by Tracing, Selecting, Scaling, Rotating, Editing, Displacing, Navigating.
    Other examples of actions from elastic projection screens [57] can be applied to FlexiVol, such as pushing, twisting (e.g. as a combination of selecting, editing and rotating), squeezing (e.g., as a combination of selecting, editing and scaling down), or zooming-in/out (e.g., as scaling).
    6.2.2 Gestures.
    We represent in Figure 13 the main user gestures in FlexiVol. They are a combination of gestures from the literature involving either touchscreens, multi-touch displays, and augmented/virtual reality 3D object manipulation [27, 55, 60]. In Figure 13, a common mapping from Gestures to Actions is shown. However, other mappings are possible. For instance, Selecting could be performed by Touching (as in our user study - see Section 7) or by Grasping between the fingers [12]. Displacing can be performed by Pushing (as in our suggested applications - Section 9), or by Grasping, and Pinching. We also depict a walking Gesture for Navigating: Alternate Swiping. This gesture is metaphor-like and users can move their fingers to mimic a mini-character walking inside the display. When the ring and pinky finger are flexed the action is triggered, taking the direction of the backhand and the displacement of the movement of the index and heart fingers.
    Different Input types can be used for each gesture. For instance, a pinching gesture can be performed with one hand (e.g., between two fingers of the same hand) or between two fingers of independent hands, to represent a scaling-down action. Similarly, swiping can involve one finger (e.g., as per the illustration), or two (e.g., as per gesture with Apple’s trackpad to represent dragging actions [55]).

    \\section{Conclusion}
    We have shown the concept of modifying swept volumetric display with an elastic diffuser to allow users to reach inside the display volume for interaction. When the elastic diffuser collides with the hand it does not damage the user and the localised deformation does not significantly distort the graphics. We showed in a user study how FlexiVol with direct interaction provides relatively good results in selection, docking and tracing tasks when compared with a 3D mouse using indirect interaction. FlexiVol provides coherent focus accommodation for both the real hand and the virtual graphics facilitating further the direct interaction between the user and the rendered objects. We believe that this simple yet significant improvement on volumetric displays creates new opportunities for exploring the unique advantages of volumetric displays and direct reach-through interaction.
 
    \\References{sample}

    \\end{document}`;

  // CodeMirror 초기화
  editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    mode: "text/x-stex", // LaTeX 모드
    lineNumbers: true,
    theme: "default",
    indentUnit: 2,
    smartIndent: true,
    lineWrapping: true,
    matchBrackets: true,
    styleActiveLine: true,
  });

  // 에디터에 소스 코드 설정
  editor.setValue(latexSource);

  // HTML 미리보기 초기 렌더링
  compileLatex();

  // 파일 클릭 이벤트 리스너 추가
  const fileItems = document.querySelectorAll(".file-item");
  fileItems.forEach((item) => {
    item.addEventListener("click", handleFileClick);
  });

  // 컴파일 버튼 클릭 이벤트 리스너
  document
    .getElementById("compile-btn")
    .addEventListener("click", compileLatex);

  // 에디터 변경 이벤트 리스너
  editor.on("change", () => {
    // 현재 활성화된 파일이 main.tex인 경우 소스 코드 업데이트
    const activeFile = document.querySelector(".file-item.active");
    if (activeFile && activeFile.getAttribute("data-file") === "main.tex") {
      latexSource = editor.getValue();
    }
  });

  // 미리보기 섹션에 클릭 이벤트 리스너 추가 (인용 링크 및 PDF 링크용)
  document
    .getElementById("preview-content")
    .addEventListener("click", handleCitationClick);
};

// LaTeX 컴파일 함수
function compileLatex() {
  addLog("컴파일 중...", "info");

  try {
    // LaTeX 코드 파싱하여 HTML로 변환
    const htmlContent = parseLatex(latexSource);
    document.getElementById("preview-content").innerHTML = htmlContent;

    // MathJax로 수식 다시 처리
    if (window.MathJax) {
      MathJax.typesetPromise([document.getElementById("preview-content")])
        .then(() => {
          addLog("컴파일 완료!", "success");
        })
        .catch((err) => {
          addLog(`수식 렌더링 오류: ${err.message}`, "error");
        });
    } else {
      addLog(
        "컴파일 완료! (MathJax가 로드되지 않아 수식 렌더링이 불완전할 수 있습니다)",
        "success"
      );
    }
  } catch (error) {
    addLog(`컴파일 오류: ${error.message}`, "error");
  }
}
