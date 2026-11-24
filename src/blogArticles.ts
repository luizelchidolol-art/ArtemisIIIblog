type Source = { label: string; url: string };

type Article = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  credit: string;
  tool: "simulador" | "luna" | "orion" | "tripulacion";
  sections: { heading: string; paragraphs: string[] }[];
  sources: Source[];
};

const mission = {
  label: "NASA · Artemis III, ficha de misión",
  url: "https://www.nasa.gov/mission/artemis-iii/",
};
const octoberPlan = {
  label: "NASA · Pruebas con futuros módulos lunares en Artemis III, octubre de 2026",
  url: "https://www.nasa.gov/missions/artemis/nasas-artemis-iii-mission-to-test-future-moon-lander-operations/",
};
const novemberUpdate = {
  label: "NASA · Actualización de la secuencia de Artemis presentada en octubre, publicada en noviembre de 2026",
  url: "https://www.nasa.gov/missions/artemis/nasa-shares-plans-to-accelerate-artemis-return-to-moon/",
};
const orion = {
  label: "NASA · Orion spacecraft, referencia de la nave",
  url: "https://www.nasa.gov/reference/orion-spacecraft/",
};
const contingency = {
  label: "Abell et al. · Ponencia AAS 21-439 sobre contingencias de acoplamiento con Orion, NASA NTRS",
  url: "https://ntrs.nasa.gov/citations/20205011555",
};

export const articles: Article[] = [
  {
    slug: "por-que-artemis-iii-ensaya-en-orbita",
    title: "Por qué Artemis III ensaya en órbita terrestre",
    summary: "El valor de la misión está en reunir tres vehículos lanzados por separado y comprobar cómo trabajan como un solo sistema.",
    image: "sls.jpg",
    credit: "Despegue de Artemis II · NASA / Bill Ingalls",
    tool: "simulador",
    sections: [
      {
        heading: "La pregunta que organiza el vuelo",
        paragraphs: [
          "Un lanzamiento suele verse como el punto culminante de una misión. En Artemis III será el comienzo de una prueba entre vehículos construidos por organizaciones distintas. La NASA prevé enviar a cuatro astronautas en Orion a una órbita baja alrededor de la Tierra, donde la nave se aproximará a versiones de ensayo de módulos lunares. La pregunta es si los equipos pueden coordinar desde tierra y desde el espacio los pasos necesarios para reunirse, conectarse y volver a separarse con seguridad. [1]",
          "La misión se entiende mejor si se sigue el calendario de sus vehículos. En la secuencia descrita por la NASA tras la actualización de octubre de 2026, Blue Moon despegaría primero. Luego saldría Orion en el cohete Space Launch System, o SLS. Después del encuentro con Blue Moon, un lanzamiento separado pondría en órbita un artículo de prueba de Starship. El segundo encuentro exige terminar el primero y preparar de nuevo la nave y al equipo. El orden pertenece a un plan de vuelo anunciado. [2]",
        ],
      },
      {
        heading: "El trabajo del cohete termina antes que el de la nave",
        paragraphs: [
          "En el ascenso, los propulsores sólidos y los motores de la etapa central aceleran el conjunto. Los propulsores aportan gran parte del empuje inicial y se separan tras agotar su aporte. La etapa central emplea motores RS-25 de hidrógeno y oxígeno líquidos. El cohete debe ganar altura para dejar atrás la parte densa de la atmósfera, y debe ganar velocidad lateral para que, después de separarse, Orion siga una trayectoria alrededor de la Tierra. [3]",
          "Una forma de entender la segunda tarea es imaginar una pelota lanzada desde una gran altura. Un lanzamiento suave vuelve a tocar el suelo cerca. Si la velocidad tangencial es suficiente y se omite el efecto del aire, la superficie terrestre se curva bajo la trayectoria antes de que la pelota pueda alcanzarla. La gravedad sigue actuando durante toda la vuelta. La sensación de ingravidez en la cabina resulta de que los objetos y la nave caen juntos. [4]",
        ],
      },
      {
        heading: "Un laboratorio con límites reales",
        paragraphs: [
          "En tierra se pueden verificar equipos por separado y someter un conjunto a vibración o a condiciones térmicas controladas. En el vuelo aparecen interacciones que interesan precisamente porque sus causas vienen de lugares distintos. Una maniobra ordenada por un equipo mueve un vehículo, altera lo que ve el sensor de otro vehículo y cambia los datos que llegan a tierra. Cuanto más se parece la operación a su uso posterior, más informativa es la comparación entre lo que predijo el modelo y lo que observaron los instrumentos.",
          "Una campaña con lanzamientos separados expone además una dependencia de calendario. Si el segundo despegue se mueve, la órbita del primer vehículo continúa evolucionando. Los planificadores deben volver a evaluar la geometría del encuentro y el tiempo disponible para completarlo. El margen se reparte entre las necesidades de cada nave y el tiempo de los equipos de tierra. La actualización pública permite comprender ese encadenamiento sin conocer el detalle de las ventanas de lanzamiento ni los límites internos de los sistemas. [2]",
          "El estado de cada vehículo al llegar a órbita también cambia la prueba. Durante las comprobaciones iniciales, cada organización necesita confirmar que sus instrumentos y sistemas responden como se esperaba tras el lanzamiento. Una vez que las máquinas se acercan, una duda sobre cualquiera de ellas puede modificar el programa de las otras. Esa dependencia entre equipos explica el valor de registrar cómo comparten información y autorizan cada avance. [1] [2]",
        ],
      },
      {
        heading: "Qué evidencia podría producir",
        paragraphs: [
          "Un acoplamiento exitoso puede dar información sobre alineación, contacto, transmisión de datos y respuesta de la unión al movimiento. También interesa registrar cuándo se suspendió un acercamiento, cuánto tardó el sistema en reconocer una desviación y qué información tuvo la tripulación para actuar. Una interrupción que respeta su procedimiento puede ser un resultado útil. Los ingenieros necesitan saber qué parte del sistema detectó el problema y si se conservó la separación necesaria para intentar otra maniobra. [5]",
          "Un sistema evaluado alrededor de la Tierra deberá afrontar después condiciones distintas cerca de la Luna. En un vuelo posterior cambian la geometría, la cobertura de comunicaciones, las oportunidades de retorno y, durante el descenso a la superficie, las condiciones de iluminación y el terreno. Eso explica por qué se programa una prueba integrada antes de pedir al mismo conjunto de tecnologías que sostenga una operación de mayor alcance. El informe con el que se juzgue el ensayo requerirá datos del propio vuelo. [1]",
        ],
      },
      {
        heading: "Cómo leer el simulador sin confundirlo con telemetría",
        paragraphs: [
          "En el simulador, compara la velocidad respecto a la Tierra con la velocidad relativa al objetivo. Cuando dos vehículos comparten una órbita parecida, ambos pueden viajar muy rápido con respecto al planeta y, a la vez, acercarse muy despacio entre sí. Observa cuándo aparece una lectura de distancia al objetivo. Durante el ascenso la prioridad es establecer la órbita. En la aproximación la pregunta pasa a ser cuánto cambian la posición y la orientación de una nave con respecto a la otra.",
          "Los instrumentos del sitio muestran valores didácticos para relacionar estas ideas. Cada fase sirve como ocasión para una comprobación sencilla. Pausa el vuelo durante la separación de etapas y durante el encuentro. En la primera, piensa en la masa que la etapa restante debe acelerar. En la segunda, pregúntate por qué una velocidad de cierre demasiado alta consumiría el margen para detenerse. El recorrido permite interpretar una misión que todavía está por volar a partir de principios observables en cualquier vuelo orbital.",
        ],
      },
    ],
    sources: [
      mission,
      novemberUpdate,
      { label: "NASA · Space Launch System", url: "https://www.nasa.gov/reference/space-launch-system/" },
      { label: "NASA · What is microgravity?", url: "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-2/" },
      contingency,
    ],
  },
  {
    slug: "encontrarse-y-acoplarse-en-el-espacio",
    title: "Cómo se encuentran dos naves que ya están en órbita",
    summary: "Ajustar el tiempo de llegada, medir la distancia y mantener una ruta de retirada son partes del mismo problema de ingeniería.",
    image: "research-operations.jpg",
    credit: "Ilustración técnica del plan de Artemis III · NASA",
    tool: "simulador",
    sections: [
      {
        heading: "Llegar al mismo lugar en el mismo momento",
        paragraphs: [
          "Dos naves pueden pasar sobre el mismo lugar del planeta y estar separadas por cientos de kilómetros o por varios minutos de vuelo. Un encuentro orbital exige coordinar el tiempo junto con la forma de la trayectoria. Cada vehículo tiene que alcanzar la región adecuada con una velocidad compatible con la del objetivo. Una posición compartida con velocidades muy distintas sería un cruce rápido. Un encuentro útil deja tiempo para observar, corregir el rumbo y preparar las dos naves antes de cualquier contacto. [1]",
          "El problema tiene una peculiaridad. En una órbita casi circular algo más baja, la vuelta completa dura menos. Un vehículo que se sitúe temporalmente en esa trayectoria puede ganar terreno angular aunque no esté apuntando su motor continuamente hacia el objetivo. Después, nuevas maniobras ajustan la órbita y reducen las diferencias. La revisión académica de Luo, Zhang y Tang reúne modelos y métodos generales para interpretar estos cambios. El plan de NASA establece las operaciones concretas de Artemis III. [5] [1]",
        ],
      },
      {
        heading: "Medir lo que importa cerca del objetivo",
        paragraphs: [
          "La distancia por sí sola dice poco. A diez metros del puerto importa cuánto cambia esa distancia por segundo, si la nave se desplaza de lado y en qué ángulo se encuentra respecto del eje de acoplamiento. La pose relativa describe la posición y la orientación de un cuerpo visto desde el otro. Estimar esa pose requiere combinar observaciones que pueden cambiar según la iluminación, la forma del vehículo y la visibilidad de los elementos que el sistema de navegación toma como referencia. [1] [2]",
          "La revisión académica muestra por qué se suele dividir el encuentro en partes. El modelo que sirve para calcular cuándo se alcanzará la vecindad del objetivo puede concentrarse en las órbitas y en sus diferencias. Para el enlace físico también se necesita saber hacia dónde apuntan los dos puertos y cuánto giran. Cambiar de escala modifica qué datos se requieren y qué errores merecen atención. [5]",
          "Durante el acercamiento, una estación de control puede seguir el progreso con datos de ambas naves. La tripulación también necesita una presentación clara de lo que se está midiendo y del estado de validez de cada lectura. Una cifra estable en una pantalla puede ser una medición útil o un dato que dejó de actualizarse. Los procedimientos distinguen ambos casos para que un equipo pueda identificar una pérdida de navegación y reaccionar antes de consumir su margen de separación. [2]",
        ],
      },
      {
        heading: "Qué sucede cuando los puertos se tocan",
        paragraphs: [
          "La primera captura ayuda a absorber parte del movimiento y corregir pequeñas diferencias de alineación. La unión firme se establece después. La norma internacional de acoplamiento describe geometrías de interfaz y cargas de diseño que pueden usar equipos independientes para desarrollar puertos compatibles. También identifica condiciones representativas para el primer contacto. Cada fabricante debe comprobar el comportamiento de su sistema integrado con el vehículo y la misión que lo utilizarán. [3]",
          "El acoplamiento tiene consecuencias distintas según lo que ocurra después. Una unión mecánica puede servir para observar el movimiento de dos vehículos conectados o para comprobar el intercambio de datos. Si además se planifica el paso de personas, se suma la secuencia de verificación del sellado, compatibilidad de atmósferas y operación de las escotillas. La NASA ha descrito objetivos diferenciados para sus artículos de prueba de Blue Moon y Starship. Conviene revisar qué parte del ensayo respalda cada afirmación. [1]",
        ],
      },
      {
        heading: "Frenar, esperar o retirarse",
        paragraphs: [
          "La ruta segura se prepara antes de acercarse. Un equipo puede ordenar una pausa para comprobar sensores o responder a una duda antes del siguiente tramo. Cuando la situación requiere alejarse, la maniobra de retirada tiene que considerar tanto la trayectoria actual como la que seguirá después. Una dirección que en la pantalla parece libre en ese instante puede conducir de nuevo a una intersección. Por eso los estudios de contingencias consideran el estado inicial y la evolución futura del movimiento. [2]",
          "El trabajo publicado por técnicos de Draper y NASA examina esa disciplina en un caso de Orion con Gateway alrededor de la Luna. Ese caso permite entender por qué el software organiza el vuelo en modos y transiciones. Los datos operativos de Artemis III corresponden a otro entorno y otros objetivos. La transferencia que sí puede hacerse es metodológica. Para cada fallo plausible, se identifica qué señal lo haría detectable, quién tomaría la decisión y qué acción conservaría una separación adecuada. [2]",
        ],
      },
      {
        heading: "Dos ensayos, una forma de compararlos",
        paragraphs: [
          "El plan anunciado prevé que Orion se encuentre con Blue Moon y más tarde con Starship. Los puertos aparecen en ubicaciones diferentes en cada vehículo. Eso cambia el aspecto del objetivo en el campo de visión y obliga a revisar cómo se presenta la maniobra a la tripulación. Cuando los equipos comparen lo aprendido en ambas aproximaciones, las conclusiones más robustas serán las que puedan vincular a una medición, una condición de vuelo y una interfaz concreta. [1] [4]",
          "En la simulación, detén el reloj al comienzo de la aproximación y observa la distancia junto con la velocidad relativa. Repite la observación cerca del contacto. Pregunta cuánto recorrido quedaría para detenerse si la aproximación continuara a la velocidad de la primera lectura. Luego imagina que se pierde una medición justo antes de seguir. Con esas dos preguntas puedes distinguir los tres problemas que se combinan en una maniobra aparentemente sencilla. Navegar es saber dónde estás, controlar es modificar el movimiento y operar implica decidir cuándo hacerlo.",
        ],
      },
    ],
    sources: [
      octoberPlan,
      contingency,
      { label: "Donahoe · International Docking System Standard, revisión F, NASA NTRS", url: "https://ntrs.nasa.gov/citations/20220011643" },
      novemberUpdate,
      { label: "Luo, Zhang y Tang · Survey of orbital dynamics and control of space rendezvous, Chinese Journal of Aeronautics (2014)", url: "https://doi.org/10.1016/j.cja.2013.07.042" },
    ],
  },
  {
    slug: "vivir-y-trabajar-dentro-de-orion",
    title: "Cómo se mantiene habitable Orion",
    summary: "Una visita técnica a la cabina, desde el aire que respira la tripulación hasta las decisiones que toman frente a las pantallas.",
    image: "research-interior.jpg",
    credit: "Integración de la cabina de Orion para Artemis II · NASA",
    tool: "orion",
    sections: [
      {
        heading: "Una cabina que depende del resto de la nave",
        paragraphs: [
          "El módulo de tripulación de Orion concentra los asientos, pantallas, escotillas y el volumen presurizado donde viven los astronautas. Desde una fotografía del interior es fácil pensar que todo lo necesario se encuentra dentro de sus paredes. Parte de lo que hace habitable ese espacio llega del módulo de servicio europeo. Fuera de la cabina trabajan los sistemas que suministran recursos, producen electricidad y controlan movimientos. La habitabilidad surge de muchas interfaces que deben funcionar juntas durante todo el vuelo. [1] [2]",
          "El módulo de servicio también tiene una vida operativa distinta. Durante el vuelo aporta propulsión y ayuda a controlar la temperatura. Antes del regreso se separa la cápsula que debe proteger a las personas durante la entrada en la atmósfera y el amerizaje. La transición obliga a definir con precisión qué capacidades se necesitan en cada fase. Para estudiar la nave conviene seguir las funciones en el tiempo, porque la respuesta a qué componente sostiene a la tripulación cambia a lo largo del viaje. [1]",
        ],
      },
      {
        heading: "Respirar es un problema de balance",
        paragraphs: [
          "Mientras una persona respira, consume oxígeno y produce dióxido de carbono. En un recinto cerrado se añaden el calor de los cuerpos, la humedad que liberan y los residuos de la actividad diaria. El control ambiental mantiene la presión y la composición del aire en rangos compatibles con el trabajo humano. Entre los recursos que Orion lleva para esa tarea están las reservas de oxígeno y nitrógeno. Aportar gas y retirar compuestos del aire son tareas complementarias. [3]",
          "La ventilación distribuye el aire alrededor de los ocupantes y transporta hacia los equipos de tratamiento lo que deben retirar. También ayuda a mantener condiciones más uniformes en una cabina ocupada por varias personas. Cada decisión repercute en otras partes de la nave. Un ventilador consume electricidad, hace ruido y aporta algo de calor. Un sensor necesita una ubicación representativa, y su cableado debe seguir accesible para verificarlo. Los ensayos integrados de soporte vital se ocupan de esas dependencias. [3] [4]",
          "Un demostrador asociado al programa Orion usó dos lechos con aminas. Mientras uno capturaba dióxido de carbono y vapor de agua del aire, el otro se regeneraba al exponerlo al vacío. El informe técnico permite seguir la evolución de esa tecnología y entender por qué se ensaya repetidamente un ciclo. El rendimiento debe mantenerse a través de las transiciones, cuando los dos lechos intercambian sus tareas. [7]",
        ],
      },
      {
        heading: "Agua para personas y energía para equipos",
        paragraphs: [
          "El agua potable llega desde el sistema de almacenamiento del módulo de servicio. La cantidad que debe llevarse depende de la duración prevista y de los márgenes para contingencias. Al pensar en una reserva conviene distinguir capacidad total y cantidad disponible en un momento dado. La ingeniería debe seguir el recurso desde el tanque hasta su punto de uso, incluyendo el control de calidad y la interfaz con la que la persona extrae una porción. [2] [3]",
          "La electricidad sigue una cadena paralela. Las alas solares convierten radiación en electricidad y el sistema distribuye energía a cargas con necesidades diferentes. Puede haber periodos de menor producción mientras la nave atraviesa la sombra terrestre o cambia de orientación. El diseño de una operación debe tomar en cuenta esas transiciones. Un instrumento de navegación, una bomba y una pantalla necesitan energía antes de que el equipo pueda aprovechar sus mediciones o responder a una orden. [2]",
        ],
      },
      {
        heading: "Qué debe decir una pantalla en el momento justo",
        paragraphs: [
          "Las pantallas de Orion presentan estados y permiten que la tripulación interactúe con los sistemas. La información útil depende de lo que está ocurriendo. En el ascenso importan los indicadores de la etapa y la integridad de la nave. Durante un encuentro interesan las condiciones de navegación relativa. Una interfaz que agrupara todos los datos con la misma prominencia dificultaría detectar lo que requiere atención inmediata. El diseño de los controles es una parte de ingeniería de la misión. [3]",
          "La ergonomía también se prepara con prácticas físicas. Alcanzar un control, interpretar un mensaje y confirmar una orden son tareas distintas cuando la persona lleva traje y está sujeta al asiento. Los ensayos de Artemis II documentados por NASA permitieron practicar la ubicación de instrumentos y las secuencias de operación del vehículo. La experiencia del programa permite identificar decisiones que deben ensayarse antes de ejecutar una aproximación con otro vehículo al otro lado de la ventana. [4] [5]",
        ],
      },
      {
        heading: "La escotilla conecta dos sistemas habitables",
        paragraphs: [
          "Una escotilla cerrada forma parte de una frontera de presión. El contacto de dos puertos por fuera agrega una interfaz que debe mantener una unión estable. Si se planea abrir un paso para la tripulación, el sellado y las condiciones atmosféricas del volumen conectado son problemas que deben tratarse de manera explícita. En el plan de Artemis III la NASA describe objetivos de trabajo con distintos artículos de prueba. El anuncio de un contacto mecánico por sí solo aporta información sobre la unión y deja abiertas las preguntas sobre una transferencia humana. [6]",
          "Cuando abras el modelo de Orion, localiza primero la cabina y después el módulo de servicio. Sigue tres recorridos imaginarios. Uno lleva aire y agua hacia la tripulación, otro conduce energía hacia un instrumento y un tercero devuelve al control un dato sobre el estado de la nave. La actividad deja al descubierto lo fácil que sería perder una dependencia si solo se hiciera una lista de piezas. Cada recorrido conecta una necesidad humana con decisiones de diseño, pruebas y procedimientos de vuelo.",
        ],
      },
    ],
    sources: [
      orion,
      { label: "ESA · Artemis III y módulo de servicio europeo", url: "https://www.esa.int/articles/about-us/directorates/human-and-robotic-exploration/moon/artemis/artemis-iii" },
      { label: "NASA · Crew systems, soporte vital y controles de Orion", url: "https://www.nasa.gov/reference/crew-systems/" },
      { label: "NASA · Life Support Systems: From Space Station to Orion, entrevista con personal técnico", url: "https://www.nasa.gov/podcasts/small-steps-giant-leaps/life-support-systems-from-space-station-to-orion/" },
      { label: "NASA · Entrenamiento de tripulación para Artemis II", url: "https://www.nasa.gov/centers-and-facilities/johnson/preparing-for-artemis-ii-training-for-a-mission-around-the-moon/" },
      octoberPlan,
      { label: "NASA NTRS · Amine Swingbed Payload Technology Demonstration (2014)", url: "https://ntrs.nasa.gov/citations/20140008288" },
    ],
  },
  {
    slug: "de-apollo-al-polo-sur-en-el-mapa",
    title: "Cómo leer un mapa lunar, de Apollo al polo sur",
    summary: "Coordenadas, sombras y mapas de candidatura cuentan historias distintas. Aprende a distinguir qué evidencia aporta cada una.",
    image: "lunar-shackleton.png",
    credit: "Mapa de iluminación del polo sur lunar · NASA / GSFC / Arizona State University",
    tool: "luna",
    sections: [
      {
        heading: "Del globo al mapa plano",
        paragraphs: [
          "Un atlas global pasa un relieve esférico a una superficie plana. El mosaico del explorador lunar usa una proyección equirectangular. Las líneas de latitud y longitud se transforman en una cuadrícula fácil de leer, a costa de agrandar visualmente las zonas que se acercan a los polos. En la Luna, dos puntos separados un grado de longitud están físicamente más cerca entre sí cuando se hallan cerca del polo que cuando están en el ecuador. Ese efecto explica por qué el atlas global y un mapa polar sirven para preguntas diferentes. [1]",
          "El mosaico se basa en datos del orbitador Lunar Reconnaissance Orbiter. Al comparar claros y oscuros hay que tener en cuenta cómo se construyó la imagen. Una zona puede verse oscura porque refleja menos luz, porque la luz llega con otro ángulo o porque parte del relieve está en sombra. La descripción del producto ayuda a saber qué ofrece una vista global y cuándo se requieren datos de elevación o imágenes registradas a distintas horas. [1] [2]",
        ],
      },
      {
        heading: "Dos huellas de Apollo sobre el mismo globo",
        paragraphs: [
          "Busca Apollo 11 cerca del ecuador lunar. Su módulo descendió hacia Mare Tranquillitatis, una región de lavas solidificadas que rellenaron una cuenca antigua. La localización histórica que muestra el mapa corresponde al módulo, con coordenadas derivadas de imágenes orbitales. Algunos instrumentos que dejaron los astronautas tienen sus propias coordenadas, separadas del punto donde se posó el módulo. Esa distinción importa a la hora de comparar catálogos con una fotografía de la zona. [3] [9]",
          "Apollo 17 se posó en el valle Taurus-Littrow. Allí la selección científica buscó acceso a rocas antiguas de las tierras altas y materiales de origen volcánico. En una misión con movilidad sobre la superficie, la posibilidad de llegar a distintos afloramientos influye en la elección del sitio. Comparar Apollo 11 y Apollo 17 revela dos tipos de pregunta. La primera exige una superficie apta para efectuar un descenso temprano del programa. La segunda aprovecha una operación más extensa para obtener muestras de orígenes contrastantes. [3] [4]",
        ],
      },
      {
        heading: "Luz rasante, sombras duraderas",
        paragraphs: [
          "Al acercar el mapa hacia el sur aparece Shackleton. Cerca del polo, el Sol puede elevarse muy poco respecto al horizonte. Una elevación moderada basta entonces para proyectar una sombra larga. Algunos fondos de cráter reciben tan poca luz directa que mantienen condiciones aptas para preservar depósitos de hielo. Un único fotograma muestra un instante. El mapa de iluminación de NASA combina observaciones tomadas en momentos diferentes para representar mejor qué partes del relieve reciben luz a lo largo del tiempo. [2]",
          "La luz interesa también al equipo que prepara una expedición. Un panel solar produce energía cuando su orientación y la iluminación lo permiten. Las pendientes y las zonas de sombra influyen en la visibilidad y la dificultad del desplazamiento. Una región científicamente atractiva puede exigir un itinerario que cuide energía, terreno y comunicaciones. Estos criterios explican por qué aparecen varias áreas candidatas alrededor del polo. Cada una equilibra condiciones que deben estudiarse a la escala del lugar donde se prevé operar. [5]",
          "Un equipo encabezado por Shuai Li analizó datos de espectros del instrumento Moon Mineralogy Mapper, que voló en la sonda india Chandrayaan-1. El estudio encontró señales diagnósticas de hielo expuesto en lugares polares sombreados. La evidencia espectral permite identificar materiales a partir de la luz que reflejan en diferentes longitudes de onda. Un mapa de sombras ayuda a localizar ambientes posibles. Para identificar hielo se requieren esas observaciones adicionales. [8]",
        ],
      },
      {
        heading: "Un punto de interés y una región candidata",
        paragraphs: [
          "Mons Mouton es una montaña con nombre oficial. Su coordenada de catálogo indica el centro de un accidente geográfico extenso. Los estudios de alunizaje muestran áreas de evaluación que pueden llevar el nombre de esa montaña o de un rasgo cercano. Si colocas ambos datos en el mismo mapa, el punto central de la montaña sirve de referencia para orientarte. El contorno de una región candidata contiene la información espacial necesaria para saber qué lugares fueron considerados en un estudio. [5] [6]",
          "También se necesita la fecha del mapa. Algunas imágenes antiguas de candidatos conservan etiquetas de Artemis III porque fueron publicadas cuando esa misión se concebía de otra manera. La NASA presenta ahora Artemis III como una demostración en órbita terrestre baja. La cartografía anterior sigue aportando contexto sobre el terreno y el proceso de selección lunar. La ficha vigente organiza los vuelos y el estudio histórico explica una etapa del análisis. Fechar ambos permite usar cada uno para su pregunta. [5] [7]",
        ],
      },
      {
        heading: "Un ejercicio para inspeccionar la evidencia",
        paragraphs: [
          "Abre Apollo 11, después Shackleton y por último Mons Mouton. Anota para cada sitio qué representa el marcador. Encontrarás un lugar histórico, un cráter de interés científico y una referencia geográfica vinculada a estudios de candidatura. Compara la fotografía de superficie con el mapa de iluminación y con la imagen de regiones candidatas. La primera registra una visita. El segundo combina datos para mostrar el comportamiento de la luz. El tercero comunica decisiones preliminares de selección. [2] [3] [5]",
          "Repite la tarea con otro par de regiones preguntándote qué medidas faltan para comparar si serían adecuadas para operar. Un mapa de color puede orientar la comparación pero difícilmente basta para calcular una pendiente exacta o conocer cuánto dura la luz en un punto. El buen uso del atlas empieza por identificar el producto, la escala y la fuente. Consultar el origen de una coordenada es parte del mismo razonamiento con el que un equipo combina cartografía, observaciones y requisitos operativos.",
        ],
      },
    ],
    sources: [
      { label: "NASA Scientific Visualization Studio · CGI Moon Kit, cartografía LRO", url: "https://svs.gsfc.nasa.gov/4720/" },
      { label: "NASA Science · Mapa de iluminación del polo sur", url: "https://science.nasa.gov/resource/illumination-map-of-the-moons-south-pole/" },
      { label: "NASA NSSDC · Coordenadas de alunizaje de Apollo", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html" },
      { label: "NASA · Apollo 17, selección del sitio y objetivos", url: "https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" },
      { label: "NASA · Living and working on the Moon, regiones candidatas", url: "https://www.nasa.gov/feature/living-and-working-on-the-moon/" },
      { label: "USGS · Mons Mouton en el nomenclátor planetario", url: "https://planetarynames.wr.usgs.gov/Feature/16070" },
      mission,
      { label: "Li et al. · Direct evidence of surface exposed water ice in the lunar polar regions, PNAS (2018)", url: "https://doi.org/10.1073/pnas.1802345115" },
      { label: "NASA Science · Mare Tranquillitatis, cuenca de impacto y lavas basálticas", url: "https://science.nasa.gov/image-detail/20100528/" },
    ],
  },
  {
    slug: "quienes-preparan-artemis-iii",
    title: "Quiénes convierten el plan de Artemis III en un ensayo de vuelo",
    summary: "Las trayectorias de los cuatro astronautas abren una ventana al trabajo compartido entre cabina, control y equipos de ingeniería.",
    image: "research-crew.jpg",
    credit: "Retrato oficial de la tripulación de Artemis III · NASA / Bill Stafford",
    tool: "tripulacion",
    sections: [
      {
        heading: "Qué confirma un anuncio de tripulación",
        paragraphs: [
          "El 9 de junio de 2026 la NASA presentó a la tripulación principal de Artemis III. Randy Bresnik es el comandante. Luca Parmitano, astronauta de la Agencia Espacial Europea, es el piloto. Frank Rubio y Andre Douglas son especialistas de misión. La asignación establece las funciones oficiales de cada integrante. A partir de ahí, las biografías permiten entender la experiencia que aportan, mientras que las actualizaciones del vuelo documentan qué se ensayará en órbita y con qué vehículos. [1] [2]",
          "Una entrevista grabada durante el anuncio y un parte publicado meses después responden preguntas diferentes. La primera permite escuchar cómo los astronautas describen la preparación. El segundo puede indicar el comienzo de una práctica conjunta o un cambio de arquitectura. NASA informó en agosto de 2026 que el entrenamiento abarcaba sistemas y operaciones de Orion, formación de equipo y ejercicios con proveedores de módulos comerciales. Esa información ofrece un punto de partida para estudiar el trabajo del grupo. [3]",
          "El comunicado también anunció a Bob Hines como astronauta de respaldo. Esa distinción muestra que una asignación de vuelo incluye preparativos para cubrir cambios en el equipo. Cuando una noticia enumera cinco nombres, conviene identificar cuáles integran la tripulación principal y cuál tiene esa responsabilidad de respaldo. La presentación pública de cada función ayuda a interpretar la fotografía oficial, los informes de entrenamiento y las listas de participantes. [1] [2]",
        ],
      },
      {
        heading: "Vuelo de prueba y experiencia de mando",
        paragraphs: [
          "Bresnik fue piloto de pruebas y voló en la misión STS-129 del transbordador. Años después fue ingeniero de vuelo de la Expedición 52 y comandante de la Expedición 53 de la Estación Espacial Internacional. Esas actividades ayudan a entender por qué el mando combina el conocimiento directo de una máquina con el seguimiento de tareas que se reparten entre muchas personas. En un ensayo, una instrucción puede requerir que dos especialistas observen instrumentos diferentes y confirmen el mismo estado operativo. [4]",
          "Parmitano pasó por la formación de piloto de pruebas y realizó las misiones Volare y Beyond. Durante Beyond comandó la Estación Espacial Internacional y participó en trabajos en el exterior relacionados con el Espectrómetro Magnético Alfa. La biografía de ESA permite comprobar esas misiones y su asignación como piloto. También muestra una carrera en la que se alternan cabinas, laboratorios y procedimientos de mantenimiento. Esa variedad es relevante en una prueba que combina nuevas interfaces con métodos aprendidos en vuelos previos. [5] [2]",
        ],
      },
      {
        heading: "Salud humana y lectura de sistemas complejos",
        paragraphs: [
          "Rubio se formó en medicina y fue piloto de helicópteros UH-60. Su estancia de 371 días en el espacio y sus caminatas espaciales están documentadas por la NASA. Leer su perfil ayuda a conectar dos preguntas que suelen separarse. Por un lado, cómo responde el cuerpo a un entorno de trabajo fuera de la Tierra. Por otro, qué debe medir un equipo para reconocer una condición que puede afectar a quienes operan un vehículo. [6]",
          "Douglas es doctor en ingeniería de sistemas y trabajó en ingeniería naval en la Guardia Costera estadounidense. Más tarde participó en trabajos de robótica y en el desarrollo de la misión de defensa planetaria DART en el Laboratorio de Física Aplicada de Johns Hopkins. Es una trayectoria útil para explicar una tarea que atraviesa muchas especialidades. Vincular requisitos, comprobar interfaces y examinar el efecto de un fallo son hábitos de trabajo aplicables a distintos vehículos. Las pruebas de integración ponen esos hábitos en contacto con operaciones reales. [7]",
        ],
      },
      {
        heading: "Qué se aprende antes de abandonar la Tierra",
        paragraphs: [
          "Una sesión de práctica hace visible cómo circula la información. La cabina observa el estado de Orion y los equipos de tierra reciben telemetría que pueden contrastar con la actividad de los otros vehículos. Una buena práctica define qué mensaje debe activar una comprobación, quién puede autorizar que continúe la maniobra y qué lectura confirmará que la orden produjo el efecto esperado. Las actualizaciones públicas sobre el entrenamiento conjunto documentan la coordinación general entre organizaciones. Los detalles concretos de una sesión pueden permanecer fuera de ese informe. [3]",
          "Un caso sencillo de entrenamiento sería comprobar que una instrucción importante se entiende igual en la cabina y en tierra. El instructor podría introducir una lectura tardía, pedir a los participantes que reconozcan la discrepancia y observar si coinciden al describir el siguiente estado permitido. Esta situación hipotética muestra por qué las habilidades de comunicación afectan a la seguridad. En una cadena de decisiones, una frase ambigua puede demorar la comprobación de un dato aunque todos los equipos electrónicos estén trabajando correctamente.",
        ],
      },
      {
        heading: "Cómo informar sobre una misión que aún se prepara",
        paragraphs: [
          "El equipo anunciado, la experiencia ya documentada y las próximas operaciones tienen respaldos distintos. Al describir la misión conviene unir cada afirmación con la fuente que le corresponde y conservar la fecha de publicación. Un estudio experimental sobre comunicación científica encontró que explicar la incertidumbre numérica tuvo efectos pequeños sobre la confianza en los contextos que evaluó. Aplicado aquí, el principio favorece fórmulas concretas. Una fecha es una previsión, y una maniobra descrita en un plan sigue pendiente de ejecución. [1] [8] [9]",
          "En las fichas de tripulación puedes comparar una función confirmada con un dato biográfico. Elige a dos astronautas y sigue sus enlaces oficiales. Anota una habilidad que cada uno desarrolló durante su carrera y una tarea que un ensayo como Artemis III necesitaría, como interpretar avisos, mantener una lista de comprobaciones o contrastar datos durante una aproximación. Explica la relación como inferencia propia. Así podrás hablar de la contribución profesional del equipo sin atribuir una maniobra concreta a alguien sin un respaldo documental.",
        ],
      },
    ],
    sources: [
      { label: "NASA en español · Anuncio de la tripulación de Artemis III, 9 de junio de 2026", url: "https://www.nasa.gov/news-release/la-nasa-avanza-hacia-la-mision-artemis-iii-en-2027-y-anuncia-a-su-tripulacion/" },
      { label: "NASA · Our Artemis III Crew, funciones oficiales", url: "https://www.nasa.gov/our-artemis-iii-crew/" },
      { label: "NASA · Actualización del entrenamiento y la integración, 27 de agosto de 2026", url: "https://www.nasa.gov/blogs/missions/2026/08/27/nasa-starts-artemis-iii-engine-install-boosters-crew-training-advance/" },
      { label: "NASA · Biografía de Randy Bresnik", url: "https://www.nasa.gov/people/randolph-komrade-bresnik/" },
      { label: "ESA · Biografía de Luca Parmitano", url: "https://www.esa.int/articles/about-us/directorates/human-and-robotic-exploration/astronauts/luca-parmitano" },
      { label: "NASA · Biografía de Frank Rubio", url: "https://www.nasa.gov/people/frank-rubio/" },
      { label: "NASA · Biografía de Andre Douglas", url: "https://www.nasa.gov/people/nasa-astronaut-andre-douglas/" },
      { label: "van der Bles et al. · The effects of communicating uncertainty on public trust in facts and numbers, PNAS (2020)", url: "https://doi.org/10.1073/pnas.1913678117" },
      octoberPlan,
    ],
  },
];
