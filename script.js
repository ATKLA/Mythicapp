// =========================
// Datos
// =========================
const MYTHS = [
    /* Egipcia */
    { era: 'egipcia', titulo: 'El juicio de Osiris', resumen: 'El alma se pesa con la pluma de Maat.', detalle: 'En el tribunal de Osiris, el corazón se compara con la pluma de Maat para decidir el destino del difunto.', ref: 'Libro de los Muertos' },
    { era: 'egipcia', titulo: 'Ra y el viaje nocturno', resumen: 'Cada noche cruza el Duat.', detalle: 'Ra navega el inframundo y combate a Apofis para renacer al amanecer.', ref: 'Textos de las Pirámides' },
    { era: 'egipcia', titulo: 'Isis y el nombre secreto', resumen: 'Isis arranca a Ra su nombre oculto.', detalle: 'Para curarlo de una mordedura, obtiene su nombre y un poder equiparable.', ref: 'Papiros mágicos' },
    { era: 'egipcia', titulo: 'Osiris y Set', resumen: 'Set asesina y desmiembra a Osiris.', detalle: 'Isis recompone a Osiris y Horus disputa el trono hasta vencer a Set.', ref: 'Mito osiriaco' },
    { era: 'egipcia', titulo: 'Horus vs. Set', resumen: 'Lucha por el trono de Egipto.', detalle: 'Tras pruebas divinas, Horus restaura el orden (Maat) sobre el caos.', ref: 'Textos de los Sarcófagos' },
    { era: 'egipcia', titulo: 'El ave Bennu', resumen: 'Arquetipo del fénix.', detalle: 'Ave solar de renacimiento y ciclo cósmico.', ref: 'Tradición heliopolitana' },
    { era: 'egipcia', titulo: 'La creación de Ptah', resumen: 'Crea el mundo con su palabra.', detalle: 'En Memphis, Ptah concibe y habla la creación, anticipando el logos.', ref: 'Teología Menfita' },
    { era: 'egipcia', titulo: 'Sekhmet la destructora', resumen: 'Ra envía a Sekhmet contra la humanidad rebelde.', detalle: 'La diosa leona casi extermina a los humanos hasta que Ra la embriaga con cerveza teñida de rojo.', ref: 'Mito de la Diosa Lejana' },
    { era: 'egipcia', titulo: 'Thoth y la sabiduría', resumen: 'Escriba de los dioses e inventor de la escritura.', detalle: 'Thoth registra los corazones en el juicio y mantiene el equilibrio cósmico con su sabiduría.', ref: 'Tradición hermopolitana' },
    { era: 'egipcia', titulo: 'Hathor y los Siete Hathores', resumen: 'Profetisas del destino al nacer.', detalle: 'Las siete manifestaciones de Hathor determinan el destino de cada recién nacido.', ref: 'Cuentos populares' },

    /* Griega */
    { era: 'griega', titulo: 'Nacimiento de Atenea', resumen: 'Surge armada de la cabeza de Zeus.', detalle: 'Hefesto abre el cráneo de Zeus y Atenea nace adulta.', ref: 'Hesíodo, Teogonía' },
    { era: 'griega', titulo: 'Prometeo y el fuego', resumen: 'Entrega el fuego a los humanos.', detalle: 'Castigado por Zeus, su hígado es devorado a diario por un águila.', ref: 'Hesíodo' },
    { era: 'griega', titulo: 'Los trabajos de Hércules', resumen: 'Doce hazañas para redimirse.', detalle: 'Del león de Nemea a los establos de Augías.', ref: 'Apolodoro' },
    { era: 'griega', titulo: 'Orfeo y Eurídice', resumen: 'No mirar atrás era la condición.', detalle: 'Orfeo rompe la condición y pierde a Eurídice para siempre.', ref: 'Virgilio' },
    { era: 'griega', titulo: 'El laberinto de Creta', resumen: 'Teseo vence al Minotauro.', detalle: 'Gracias al hilo de Ariadna encuentra la salida.', ref: 'Plutarco' },
    { era: 'grieca', titulo: 'El rapto de Perséfone', resumen: 'Origen mítico de las estaciones.', detalle: 'Deméter pacta su estancia alterna con Hades.', ref: 'Himno a Deméter' },
    { era: 'griega', titulo: 'Pandora y la caja', resumen: 'Primera mujer y los males del mundo.', detalle: 'Creada por Zeus como castigo, libera todos los males pero conserva la esperanza.', ref: 'Hesíodo, Trabajos y días' },
    { era: 'griega', titulo: 'El vuelo de Ícaro', resumen: 'Las alas de cera y el sol.', detalle: 'Dédalo e Ícaro escapan del laberinto volando, pero Ícaro se acerca demasiado al sol.', ref: 'Ovidio, Metamorfosis' },
    { era: 'griega', titulo: 'Perseus y Medusa', resumen: 'El héroe que mata a la gorgona.', detalle: 'Con la ayuda de Atenea y Hermes, decapita a Medusa usando su reflejo en un escudo.', ref: 'Apolodoro' },
    { era: 'griega', titulo: 'La caja de Psique', resumen: 'Amor y curiosidad.', detalle: 'Psique debe resistir abrir la caja de belleza de Perséfone para reunirse con Eros.', ref: 'Apuleyo' },

    /* Romana */
    { era: 'romana', titulo: 'Rómulo y Remo', resumen: 'Gemelos criados por una loba.', detalle: 'Rómulo funda Roma tras el conflicto con Remo.', ref: 'Livio' },
    { era: 'romana', titulo: 'Eneas y el destino', resumen: 'De Troya a Italia.', detalle: 'Eneas funda el linaje que llevará a Roma.', ref: 'Virgilio, Eneida' },
    { era: 'romana', titulo: 'Numa Pompilio', resumen: 'Instituye rituales y calendario.', detalle: 'Ordena la vida cívica y religiosa de Roma.', ref: 'Plutarco' },
    { era: 'romana', titulo: 'El rapto de las sabinas', resumen: 'Crisis y concordia.', detalle: 'La mediación acaba en unión de pueblos.', ref: 'Livio' },
    { era: 'romana', titulo: 'Hércules y Caco', resumen: 'Ara Máxima en el Foro Boario.', detalle: 'Hércules mata a Caco; se fija su culto.', ref: 'Virgilio / Ovidio' },
    { era: 'romana', titulo: 'Lucrecia', resumen: 'Fin de la monarquía.', detalle: 'Su tragedia precipita la república.', ref: 'Livio' },
    { era: 'romana', titulo: 'Horacio en el puente', resumen: 'Un hombre contra un ejército.', detalle: 'Horacio Cocles defiende solo el puente Sublicio mientras Roma se prepara.', ref: 'Livio' },
    { era: 'romana', titulo: 'Remo y los auspicios', resumen: 'Fundación bajo el signo de los dioses.', detalle: 'Los gemelos consultan los auspicios; Rómulo ve más buitres y funda la ciudad.', ref: 'Plutarco' },
    { era: 'romana', titulo: 'Servio Tulio y Fortuna', resumen: 'El rey protegido por la diosa.', detalle: 'Servio, de origen esclavo, es elegido por Fortuna para ser rey de Roma.', ref: 'Livio' },
    { era: 'romana', titulo: 'La Sibila de Cumas', resumen: 'Los libros proféticos.', detalle: 'La Sibila vende a Tarquinio los libros que guiarán el destino de Roma.', ref: 'Plinio / Livio' },

    /* Vikinga */
    { era: 'vikinga', titulo: 'Ginnungagap', resumen: 'Creación desde el vacío.', detalle: 'De Niflheim y Muspel surgen Ymir y Audumla.', ref: 'Edda prosaica' },
    { era: 'vikinga', titulo: 'Yggdrasil', resumen: 'Árbol de los nueve mundos.', detalle: 'Sus raíces beben en pozos de sabiduría y destino.', ref: 'Edda poética' },
    { era: 'vikinga', titulo: 'Mjölnir', resumen: 'El martillo de Thor.', detalle: 'Forjado por enanos; protege Asgard.', ref: 'Edda' },
    { era: 'vikinga', titulo: 'Loki el tramposo', resumen: 'Ambiguo y decisivo.', detalle: 'Provoca y resuelve conflictos míticos.', ref: 'Edda' },
    { era: 'vikinga', titulo: 'La muerte de Baldr', resumen: 'Presagio del fin.', detalle: 'Höðr lo mata con muérdago por engaño de Loki.', ref: 'Edda' },
    { era: 'vikinga', titulo: 'Ragnarök', resumen: 'Destino de los dioses.', detalle: 'Batalla final y renacimiento del mundo.', ref: 'Völuspá' },
    { era: 'vikinga', titulo: 'La construcción de Asgard', resumen: 'El gigante constructor y su precio.', detalle: 'Un gigante ofrece construir las murallas de Asgard a cambio de Freyja, el sol y la luna.', ref: 'Edda prosaica' },
    { era: 'vikinga', titulo: 'El hidromiel de la poesía', resumen: 'Odín roba el hidromiel de los gigantes.', detalle: 'Se transforma en serpiente y águila para obtener el hidromiel que otorga sabiduría poética.', ref: 'Edda' },
    { era: 'vikinga', titulo: 'El collar de Freyja', resumen: 'Brísingamen y el precio del poder.', detalle: 'Freyja obtiene su collar mágico de los enanos a cambio de pasar una noche con cada uno.', ref: 'Sörla þáttr' },
    { era: 'vikinga', titulo: 'Fenrir y las cadenas', resumen: 'El lobo que romperá todas las ataduras.', detalle: 'Los dioses engañan a Fenrir con la cadena Gleipnir, perdiendo Tyr su mano en el proceso.', ref: 'Edda prosaica' },

    /* Azteca */
    { era: 'azteca', titulo: 'Nacimiento de Huitzilopochtli', resumen: 'Coatepec y la diosa Coatlicue.', detalle: 'De la bola de plumas nace Huitzilopochtli; vence a Coyolxauhqui en el cerro de la Serpiente.', ref: 'Tradición mexica' },
    { era: 'azteca', titulo: 'Quinto Sol', resumen: 'Creación y sacrificio cósmico.', detalle: 'El mundo actual es el Quinto Sol sostenido por sacrificios.', ref: 'Leyendas de los Soles' },
    { era: 'azteca', titulo: 'Quetzalcóatl en Mictlán', resumen: 'Crea a la humanidad con huesos.', detalle: 'Desciende al Mictlán, toma huesos de antiguos y los vivifica con su sangre.', ref: 'Códices' },
    { era: 'azteca', titulo: 'Coyolxauhqui', resumen: 'La luna desmembrada.', detalle: 'Huitzilopochtli la derrota; su disco yace al pie del Templo Mayor.', ref: 'Mitología mexica' },
    { era: 'azteca', titulo: 'Tlaloc y el diluvio', resumen: 'Inundación y renovación.', detalle: 'Un gran diluvio marca fin de era; Chalchiuhtlicue también rige aguas.', ref: 'Tradición nahua' },
    { era: 'azteca', titulo: 'Ceremonia del Fuego Nuevo', resumen: 'Reinicio del ciclo.', detalle: 'Cada 52 años se renueva el fuego para asegurar el Sol.', ref: 'Crónicas' },
    { era: 'azteca', titulo: 'La leyenda de Xochiquetzal', resumen: 'Diosa del amor y las flores.', detalle: 'Raptada por Tezcatlipoca desde el primer cielo, causa el primer adulterio divino.', ref: 'Códice Borgia' },
    { era: 'azteca', titulo: 'El nacimiento del maíz', resumen: 'Quetzalcóatl descubre el maíz.', detalle: 'Se convierte en hormiga para robar granos de maíz del interior de la montaña Tonacatepetl.', ref: 'Tradición nahua' },
    { era: 'azteca', titulo: 'Mayahuel y el pulque', resumen: 'La diosa del maguey.', detalle: 'Tzitzimimeh despedazan a Mayahuel; de sus restos nace el maguey y la bebida sagrada.', ref: 'Códices' },
    { era: 'azteca', titulo: 'Chalchiuhtotolin', resumen: 'El conejo precioso y la embriaguez.', detalle: 'Dios que castiga los excesos pero también otorga inspiración a través del pulque.', ref: 'Tradición mexica' },

    /* Japonesa */
    { era: 'japonesa', titulo: 'Izanagi e Izanami', resumen: 'Creación de las islas.', detalle: 'Desde el puente celestial agitan el océano y nacen las islas de Japón.', ref: 'Kojiki / Nihon Shoki' },
    { era: 'japonesa', titulo: 'La cueva de Amaterasu', resumen: 'La luz se oculta.', detalle: 'Amaterasu se encierra; los dioses la atraen con un espejo y danza de Ame-no-Uzume.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Susanoo y Orochi', resumen: 'Ocho cabezas, una espada.', detalle: 'Susanoo derrota a la serpiente y halla la espada Kusanagi.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Descenso de Ninigi', resumen: 'Mandato celestial.', detalle: 'Ninigi baja con los tres tesoros y funda la línea imperial.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Tsukuyomi y Uke Mochi', resumen: 'Sol y luna separados.', detalle: 'Tsukuyomi mata a la diosa del alimento; se separan día y noche.', ref: 'Nihon Shoki' },
    { era: 'japonesa', titulo: 'Izanagi en Yomi', resumen: 'Purificación y tres deidades.', detalle: 'Tras huir del Yomi, Izanagi se purifica y nacen Amaterasu, Tsukuyomi y Susanoo.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Inari y los zorros', resumen: 'Divinidad del arroz y la prosperidad.', detalle: 'Inari se manifiesta a través de zorros blancos que actúan como mensajeros divinos.', ref: 'Tradición sintoísta' },
    { era: 'japonesa', titulo: 'Momotarō', resumen: 'El niño del melocotón.', detalle: 'Nace de un melocotón gigante y derrota a los oni con ayuda de un perro, un mono y un faisán.', ref: 'Folclore japonés' },
    { era: 'japonesa', titulo: 'Urashima Tarō', resumen: 'El pescador y el palacio submarino.', detalle: 'Salva una tortuga que lo lleva al palacio del Rey Dragón; al volver, han pasado siglos.', ref: 'Tradición popular' },
    { era: 'japonesa', titulo: 'Tengu de las montañas', resumen: 'Espíritus guerreros y sabios.', detalle: 'Seres sobrenaturales que enseñan artes marciales pero castigan la arrogancia.', ref: 'Folclore medieval' }
];

// PERSONAJES EXPANDIDOS (10 por cultura)
const CHARACTERS = [

    /* Egipcia */
    { era: 'egipcia', nombre: 'Ra', rol: 'Dios solar', detalle: 'Creador y garante del orden cósmico.' },
    { era: 'egipcia', nombre: 'Isis', rol: 'Magia y maternidad', detalle: 'Protectora de reyes y artes sanadoras.' },
    { era: 'egipcia', nombre: 'Osiris', rol: 'Más allá', detalle: 'Juez de los muertos; símbolo de regeneración.' },
    { era: 'egipcia', nombre: 'Horus', rol: 'Realeza', detalle: 'Halcón, heredero de Osiris.' },
    { era: 'egipcia', nombre: 'Anubis', rol: 'Momificación', detalle: 'Chacal que guía las almas al juicio.' },
    { era: 'egipcia', nombre: 'Thoth', rol: 'Sabiduría', detalle: 'Escriba divino, inventor de la escritura.' },
    { era: 'egipcia', nombre: 'Sekhmet', rol: 'Guerra y medicina', detalle: 'Leona feroz, ojo vengador de Ra.' },
    { era: 'egipcia', nombre: 'Ptah', rol: 'Creador menfita', detalle: 'Artesano divino que crea con la palabra.' },
    { era: 'egipcia', nombre: 'Hathor', rol: 'Amor y música', detalle: 'Vaca sagrada, alegría y maternidad.' },
    { era: 'egipcia', nombre: 'Set', rol: 'Caos y desiertos', detalle: 'Hermano celoso de Osiris, dios de las tormentas.' },

    /* Griega */
    { era: 'griega', nombre: 'Zeus', rol: 'Soberano olímpico', detalle: 'Rayo, trueno y águila.' },
    { era: 'griega', nombre: 'Atenea', rol: 'Sabiduría', detalle: 'Estratega y patrona de Atenas.' },
    { era: 'griega', nombre: 'Hades', rol: 'Inframundo', detalle: 'Gobierna junto a Perséfone.' },
    { era: 'griega', nombre: 'Ariadna', rol: 'Heroína', detalle: 'El hilo que salva a Teseo.' },
    { era: 'griega', nombre: 'Prometeo', rol: 'Titán benefactor', detalle: 'Ladrón del fuego divino para la humanidad.' },
    { era: 'griega', nombre: 'Heracles', rol: 'Héroe', detalle: 'Fuerza sobrehumana, doce trabajos.' },
    { era: 'griega', nombre: 'Afrodita', rol: 'Amor y belleza', detalle: 'Nacida de la espuma del mar.' },
    { era: 'griega', nombre: 'Apolo', rol: 'Luz y música', detalle: 'Arquero divino, dios de la poesía.' },
    { era: 'griega', nombre: 'Artemisa', rol: 'Caza y luna', detalle: 'Hermana gemela de Apolo, cazadora virgen.' },
    { era: 'griega', nombre: 'Hermes', rol: 'Mensajero', detalle: 'Psicopompo, guía entre mundos.' },

    /* Romana */
    { era: 'romana', nombre: 'Júpiter', rol: 'Soberano', detalle: 'Protector del estado romano.' },
    { era: 'romana', nombre: 'Juno', rol: 'Matrimonio', detalle: 'Soberanía y vida cívica.' },
    { era: 'romana', nombre: 'Eneas', rol: 'Fundador', detalle: 'Piedad y destino hacia Italia.' },
    { era: 'romana', nombre: 'Rómulo', rol: 'Fundador de Roma', detalle: 'Instituciones y límites.' },
    { era: 'romana', nombre: 'Marte', rol: 'Guerra', detalle: 'Padre de Rómulo y Remo.' },
    { era: 'romana', nombre: 'Venus', rol: 'Amor divino', detalle: 'Madre de Eneas, protectora de Roma.' },
    { era: 'romana', nombre: 'Minerva', rol: 'Sabiduría táctica', detalle: 'Patrona de artesanos y estrategas.' },
    { era: 'romana', nombre: 'Vesta', rol: 'Hogar sagrado', detalle: 'Fuego eterno del estado romano.' },
    { era: 'romana', nombre: 'Jano', rol: 'Transiciones', detalle: 'Dios de dos caras, puertas y comienzos.' },
    { era: 'romana', nombre: 'Numa Pompilio', rol: 'Rey legislador', detalle: 'Segundo rey, organizador del culto.' },

    /* Vikinga */
    { era: 'vikinga', nombre: 'Odín', rol: 'Padre de todo', detalle: 'Sabiduría y runas.' },
    { era: 'vikinga', nombre: 'Thor', rol: 'Trueno', detalle: 'Protector con Mjölnir.' },
    { era: 'vikinga', nombre: 'Loki', rol: 'Trickster', detalle: 'Cambio y caos.' },
    { era: 'vikinga', nombre: 'Freya', rol: 'Amor y seiðr', detalle: 'Guerra y fertilidad.' },
    { era: 'vikinga', nombre: 'Baldr', rol: 'Belleza y luz', detalle: 'Hijo de Odín, amado por todos.' },
    { era: 'vikinga', nombre: 'Tyr', rol: 'Guerra justa', detalle: 'Sacrifica su mano para atar a Fenrir.' },
    { era: 'vikinga', nombre: 'Heimdall', rol: 'Guardián', detalle: 'Vigila el puente Bifrost.' },
    { era: 'vikinga', nombre: 'Frigg', rol: 'Maternidad', detalle: 'Esposa de Odín, madre de Baldr.' },
    { era: 'vikinga', nombre: 'Jörmungandr', rol: 'Serpiente del mundo', detalle: 'Rodea Midgard, enemiga de Thor.' },
    { era: 'vikinga', nombre: 'Sleipnir', rol: 'Corcel divino', detalle: 'Caballo de ocho patas de Odín.' },

    /* Azteca */
    { era: 'azteca', nombre: 'Quetzalcóatl', rol: 'Serpiente emplumada', detalle: 'Viento, sabiduría y vida.' },
    { era: 'azteca', nombre: 'Huitzilopochtli', rol: 'Guerra y sol', detalle: 'Patrono de México-Tenochtitlan.' },
    { era: 'azteca', nombre: 'Tezcatlipoca', rol: 'Noche y destino', detalle: 'Contraparte de Quetzalcóatl.' },
    { era: 'azteca', nombre: 'Coatlicue', rol: 'Madre de dioses', detalle: 'Deidad de la tierra y la vida.' },
    { era: 'azteca', nombre: 'Tlaloc', rol: 'Lluvia', detalle: 'Dios de las tormentas y fertilidad.' },
    { era: 'azteca', nombre: 'Xochiquetzal', rol: 'Amor y flores', detalle: 'Diosa de la belleza y el placer.' },
    { era: 'azteca', nombre: 'Mictlantecuhtli', rol: 'Señor de los muertos', detalle: 'Soberano del Mictlán.' },
    { era: 'azteca', nombre: 'Chalchiuhtlicue', rol: 'Aguas terrestres', detalle: 'Ríos, lagos y la lluvia fecunda.' },
    { era: 'azteca', nombre: 'Xiuhtecuhtli', rol: 'Fuego', detalle: 'Señor del año y el fuego doméstico.' },
    { era: 'azteca', nombre: 'Coyolxauhqui', rol: 'Luna', detalle: 'Hermana de Huitzilopochtli, desmembrada.' },

    /* Japonesa */
    { era: 'japonesa', nombre: 'Amaterasu', rol: 'Sol', detalle: 'Deidad suprema del panteón sintoísta.' },
    { era: 'japonesa', nombre: 'Susanoo', rol: 'Tormentas', detalle: 'Vencedor de Orochi.' },
    { era: 'japonesa', nombre: 'Tsukuyomi', rol: 'Luna', detalle: 'Hermano de Amaterasu.' },
    { era: 'japonesa', nombre: 'Izanagi', rol: 'Progenitor', detalle: 'Purificación y tres deidades nobles.' },
    { era: 'japonesa', nombre: 'Inari', rol: 'Arroz y prosperidad', detalle: 'Deidad de la fertilidad y comercio.' },
    { era: 'japonesa', nombre: 'Raijin', rol: 'Trueno', detalle: 'Demonio que controla tormentas.' },
    { era: 'japonesa', nombre: 'Fujin', rol: 'Viento', detalle: 'Compañero de Raijin, señor de los vientos.' },
    { era: 'japonesa', nombre: 'Benzaiten', rol: 'Música y sabiduría', detalle: 'Única diosa entre los siete dioses de la fortuna.' },
    { era: 'japonesa', nombre: 'Jizō', rol: 'Protector', detalle: 'Bodhisattva que protege almas perdidas.' },
    { era: 'japonesa', nombre: 'Tengu', rol: 'Guerreros místicos', detalle: 'Espíritus de las montañas, maestros marciales.' }
];

const QUESTIONS_POOL = [
    /* Egipcia */
    { era: 'egipcia', texto: '¿Qué se pesa en el juicio de Osiris?', opciones: ['El corazón', 'El cerebro', 'El hígado', 'La lengua'], correcta: 0, pista: 'Con la pluma de Maat.' },
    { era: 'egipcia', texto: '¿A quién combate Ra cada noche?', opciones: ['Apofis', 'Set', 'Bennu', 'Anubis'], correcta: 0, pista: 'Serpiente del caos.' },

    /* Griega */
    { era: 'griega', texto: '¿Quién roba el fuego para los humanos?', opciones: ['Hermes', 'Prometeo', 'Hefesto', 'Apolo'], correcta: 1, pista: 'Un titán.' },
    { era: 'griega', texto: '¿Qué héroe usa el hilo para salir del laberinto?', opciones: ['Perseo', 'Teseo', 'Jason', 'Aquiles'], correcta: 1, pista: 'Ariadna ayuda.' },
    { era: 'griega', texto: '¿De dónde nace Atenea?', opciones: ['Del mar', 'Del corazón de Hera', 'De la cabeza de Zeus', 'De un olivo'], correcta: 2, pista: 'Hefesto interviene.' },

    /* Romana */
    { era: 'romana', texto: '¿Quién funda Roma según el mito?', opciones: ['Rómulo', 'Eneas', 'Numa', 'Caco'], correcta: 0, pista: 'Conflicto con su hermano.' },
    { era: 'romana', texto: '¿Qué obra narra el viaje de Eneas?', opciones: ['Ilíada', 'Odisea', 'Eneida', 'Metamorfosis'], correcta: 2, pista: 'Virgilio.' },

    /* Vikinga */
    { era: 'vikinga', texto: '¿Cómo se llama el árbol del mundo?', opciones: ['Askr', 'Yggdrasil', 'Mímameiðr', 'Læraðr'], correcta: 1, pista: 'Eje de los nueve mundos.' },
    { era: 'vikinga', texto: '¿Qué arma distingue a Thor?', opciones: ['Gungnir', 'Draupnir', 'Mjölnir', 'Skidbladnir'], correcta: 2, pista: 'Martillo.' },
    { era: 'vikinga', texto: '¿Qué anuncia la muerte de Baldr?', opciones: ['El Ragnarök', 'El Fimbulvetr', 'El fin de Loki', 'La paz eterna'], correcta: 0, pista: 'Destino de los dioses.' },

    /* Azteca */
    { era: 'azteca', texto: '¿Dónde nace Huitzilopochtli?', opciones: ['Chicomoztoc', 'Coatepec', 'Tamoanchan', 'Texcoco'], correcta: 1, pista: 'Cerro de la Serpiente.' },
    { era: 'azteca', texto: '¿Con qué crea Quetzalcóatl a los humanos?', opciones: ['Maíz', 'Arcilla', 'Huesos del Mictlán y su sangre', 'Jade'], correcta: 2, pista: 'Desciende al Mictlán.' },
    { era: 'azteca', texto: '¿Qué sostiene el Quinto Sol?', opciones: ['Sacrificios', 'Vientos', 'Montañas', 'Cuevas'], correcta: 0, pista: 'Renovación cósmica.' },

    /* Japonesa */
    { era: 'japonesa', texto: '¿Quién se encierra en la cueva, ocultando la luz?', opciones: ['Susanoo', 'Amaterasu', 'Tsukuyomi', 'Izanami'], correcta: 1, pista: 'Es la diosa del Sol.' },
    { era: 'japonesa', texto: '¿Qué espada encuentra Susanoo en Orochi?', opciones: ['Kusanagi', 'Kusanami', 'Masamune', 'Muramasa'], correcta: 0, pista: 'Uno de los tres tesoros.' },
];

// =========================
// Estado
// =========================
let currentSection = 'home';
let currentQuestionIndex = 0;
let score = 0;
let selectedEraForQuiz = null;
let currentQuestions = [];
let wrongAnswers = []; // {q, chosen, correct}
const wrongCountByEra = new Map();

// =========================
// Utils
// =========================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $all = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function cardKey(e, fn) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }
window.cardKey = cardKey; // para los handlers inline

function forceScrollTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function setActiveNav(id) {
    const links = $all('.nav-link');
    links.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
    const active = links.find(l => l.dataset.section === id);
    if (active) { active.classList.add('active'); active.setAttribute('aria-current', 'page'); }
}

function showSection(id) {
    currentSection = id;
    $all('.section').forEach(s => s.hidden = true);
    const el = document.getElementById(id);
    if (el) el.hidden = false;
    setActiveNav(id);
    forceScrollTop();
    if (id === 'home') renderHomeScore();
    $('#main')?.focus({ preventScroll: true });
}
window.showSection = showSection;

// =========================
// Tabs accesibles (reutilizable)
// =========================
function setupTabsA11y(tabsEl, onChange) {
    const tabs = $all('.tab', tabsEl);
    function activate(idx) {
        tabs.forEach((t, i) => {
            const sel = i === idx;
            t.setAttribute('aria-selected', sel ? 'true' : 'false');
            t.tabIndex = sel ? 0 : -1;
            t.classList.toggle('active', sel);
        });
        onChange(tabs[idx].dataset.filter);
        tabs[idx].focus();
    }
    tabsEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab')) {
            activate(tabs.indexOf(e.target));
        }
    });
    tabsEl.addEventListener('keydown', (e) => {
        const current = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowRight') { e.preventDefault(); activate((current + 1) % tabs.length); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); activate((current - 1 + tabs.length) % tabs.length); }
        if (e.key === 'Home') { e.preventDefault(); activate(0); }
        if (e.key === 'End') { e.preventDefault(); activate(tabs.length - 1); }
    });
}

// =========================
// Biblioteca
// =========================
function renderMyths(filter = 'todas', search = '') {
    const grid = $('#myths-grid');
    const term = search.trim().toLowerCase();
    const items = MYTHS.filter(m => (filter === 'todas' || m.era === filter) &&
        (m.titulo.toLowerCase().includes(term) || m.resumen.toLowerCase().includes(term) || m.detalle.toLowerCase().includes(term)));
    grid.innerHTML = items.map((m, i) => `
    <article class="content-item">
      <span class="item-tag">${m.era}</span>
      <h3 class="item-title">${m.titulo}</h3>
      <div class="item-subtitle">${m.ref}</div>
      <p class="item-description">${m.resumen}</p>
      <div class="item-expandable" id="myth-expand-${i}" data-open="false" hidden>
        <p class="item-description">${m.detalle}</p>
      </div>
      <button class="expand-button" data-target="myth-expand-${i}" aria-expanded="false" aria-controls="myth-expand-${i}">Ver más</button>
    </article>
  `).join('');
    $all('.expand-button', grid).forEach(btn => {
        btn.addEventListener('click', () => {
            const box = document.getElementById(btn.dataset.target);
            const open = box.getAttribute('data-open') === 'true';
            if (open) { box.hidden = true; box.setAttribute('data-open', 'false'); btn.textContent = 'Ver más'; btn.setAttribute('aria-expanded', 'false'); }
            else { box.hidden = false; box.setAttribute('data-open', 'true'); btn.textContent = 'Ver menos'; btn.setAttribute('aria-expanded', 'true'); }
        });
    });
}

function setupLibraryControls() {
    const tabs = $('#library-tabs'); const search = $('#library-search');
    setupTabsA11y(tabs, (filter) => renderMyths(filter, search.value));
    search.addEventListener('input', () => {
        const activeTab = $all('.tab', tabs).find(t => t.getAttribute('aria-selected') === 'true');
        renderMyths(activeTab.dataset.filter, search.value);
    });
    renderMyths('todas', '');
}

// =========================
// Personajes
// =========================
function renderCharacters(filter = 'todas', search = '') {
    const grid = $('#characters-grid');
    const term = search.trim().toLowerCase();
    const items = CHARACTERS.filter(c => (filter === 'todas' || c.era === filter) &&
        (c.nombre.toLowerCase().includes(term) || c.rol.toLowerCase().includes(term) || c.detalle.toLowerCase().includes(term)));
    grid.innerHTML = items.map(c => `
    <article class="content-item">
      <span class="item-tag">${c.era}</span>
      <h3 class="item-title">${c.nombre}</h3>
      <div class="item-subtitle">${c.rol}</div>
      <p class="item-description">${c.detalle}</p>
    </article>
  `).join('');
}

function setupCharactersControls() {
    const tabs = $('#characters-tabs'); const search = $('#characters-search');
    setupTabsA11y(tabs, (filter) => renderCharacters(filter, search.value));
    search.addEventListener('input', () => {
        const activeTab = $all('.tab', tabs).find(t => t.getAttribute('aria-selected') === 'true');
        renderCharacters(activeTab.dataset.filter, search.value);
    });
    renderCharacters('todas', '');
}

// =========================
/* Quiz */
// =========================
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; }
    return array;
}

function buildQuestionSet(era = null) {
    let base = era
        ? QUESTIONS_POOL.filter(q => q.era === era).concat(QUESTIONS_POOL.filter(q => q.era !== era))
        : QUESTIONS_POOL.slice();
    base = shuffle(base).slice(0, 12);
    return base.map(q => {
        const options = q.opciones.map((text, idx) => ({ text, idx }));
        shuffle(options);
        const newCorrectIndex = options.findIndex(o => o.idx === q.correcta);
        return { ...q, opciones: options.map(o => o.text), correcta: newCorrectIndex };
    });
}

function startQuiz(era = null) {
    selectedEraForQuiz = era;
    currentQuestions = buildQuestionSet(era);
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    wrongCountByEra.clear();
    $('#score-counter').textContent = 'Puntuación: 0';
    $('#next-btn').disabled = true;
    showSection('quiz');
    updateProgress();
    renderQuestion();
}
window.startQuiz = startQuiz;

function renderQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    const total = currentQuestions.length;
    $('#question-counter').textContent = `Pregunta ${currentQuestionIndex + 1} de ${total}`;
    const html = `
    <div class="question-card" role="radiogroup" aria-label="Pregunta">
      <span class="question-meta">${q.era}</span>
      <h3 class="question-text">${q.texto}</h3>
      <div class="options">
        ${q.opciones.map((op, i) => `
          <button class="option" role="radio" aria-checked="false" data-index="${i}">
            <span class="option-number">${i + 1}</span><span>${op}</span>
          </button>
        `).join('')}
      </div>
      <div class="feedback" id="feedback" role="status" aria-live="polite"></div>
    </div>
  `;
    $('#quiz-content').innerHTML = html;

    $all('.option', $('#quiz-content')).forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn, q));
        btn.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleChoice(btn, q); }
        });
    });

    const nextBtn = $('#next-btn');
    nextBtn.disabled = true;
    nextBtn.onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) { renderQuestion(); updateProgress(); }
        else { showResults(); }
        nextBtn.disabled = true;
    };
}

function handleChoice(btn, q) {
    const choice = parseInt(btn.dataset.index, 10);
    const options = $all('.option');
    options.forEach(o => o.classList.add('disabled'));
    options.forEach(o => o.setAttribute('aria-checked', 'false'));
    btn.setAttribute('aria-checked', 'true');

    if (choice === q.correcta) {
        options[choice].classList.add('correct');
        score++; $('#score-counter').textContent = `Puntuación: ${score}`;
        showFeedback(true, '¡Bien! ' + (q.pista || ''));
    } else {
        options[choice].classList.add('incorrect');
        options[q.correcta].classList.add('correct');
        showFeedback(false, 'La correcta era: ' + q.opciones[q.correcta] + (q.pista ? ` • Pista: ${q.pista}` : ''));
        wrongAnswers.push({ q, chosen: choice, correct: q.correcta });
        wrongCountByEra.set(q.era, (wrongCountByEra.get(q.era) || 0) + 1);
    }
    $('#next-btn').disabled = false;
}

function showFeedback(ok, msg) {
    const box = $('#feedback');
    box.className = 'feedback ' + (ok ? 'correct' : 'incorrect');
    box.textContent = msg;
}

function updateProgress() {
    const total = currentQuestions.length || 12;
    const pct = total ? (currentQuestionIndex / total) * 100 : 0;
    $('#progress-fill').style.width = `${pct}%`;
}

function eraMostFailed() {
    let bestEra = null, max = 0;
    wrongCountByEra.forEach((count, era) => {
        if (count > max) { max = count; bestEra = era; }
    });
    return bestEra;
}

function showResults() {
    const total = currentQuestions.length;
    const pct = Math.round((score / total) * 100);
    const best = parseInt(localStorage.getItem('mythicaBestScore') || '0', 10);
    if (pct > best) localStorage.setItem('mythicaBestScore', String(pct));

    const msg = pct >= 80 ? '¡Épico! Dominas los hilos del mito como Atenea con un laptop.'
        : pct >= 50 ? 'Vas muy bien. Un par de odiseas más y entras al Olimpo.'
            : 'Nada de dramas: todo héroe empieza con side quests.';

    const breakdown = wrongAnswers.length
        ? `
      <div class="results-breakdown">
        <h3>Repaso rápido</h3>
        <ul>
          ${wrongAnswers.map(w => `<li><strong>${w.q.texto}</strong><br> Elegiste: ${w.q.opciones[w.chosen]} · Correcta: ${w.q.opciones[w.correct]}</li>`).join('')}
        </ul>
      </div>
    `
        : `<p class="subhead" style="margin-top:12px;">¡Perfecto! No fallaste ninguna.</p>`;

    const eraFocus = eraMostFailed();
    const cta = eraFocus
        ? `<div class="results-actions" style="margin-top:8px;"><button class="btn-secondary" id="review-era">Explorar mitos ${eraFocus}</button></div>`
        : '';

    $('#results-content').innerHTML = `
    <div class="score-display">${score}/${total}</div>
    <div class="percentage">${pct}%</div>
    <p class="results-message">${msg}</p>
    <div class="results-actions">
      <button class="btn-primary" id="retry-quiz">Reintentar</button>
      <button class="btn-secondary" id="go-library">Ir a la Biblioteca</button>
      <button class="btn-secondary" id="go-home">Volver al Inicio</button>
    </div>
    ${breakdown}
    ${cta}
  `;

    showSection('results');

    $('#retry-quiz').addEventListener('click', () => startQuiz(selectedEraForQuiz));
    $('#go-library').addEventListener('click', () => showSection('library'));
    $('#go-home').addEventListener('click', () => showSection('home'));
    $('#review-era')?.addEventListener('click', () => {
        showSection('library');
        const tabs = $('#library-tabs');
        const tabList = $all('.tab', tabs);
        const idx = tabList.findIndex(t => t.dataset.filter === eraFocus);
        if (idx >= 0) {
            tabList.forEach((t, i) => {
                const sel = i === idx;
                t.setAttribute('aria-selected', sel ? 'true' : 'false');
                t.tabIndex = sel ? 0 : -1;
                t.classList.toggle('active', sel);
            });
        }
        renderMyths(eraFocus, $('#library-search').value);
    });
}

function renderHomeScore() {
    const best = localStorage.getItem('mythicaBestScore');
    const container = $('#home-score'); if (!container) return;
    container.innerHTML = best ? `
    <div class="score-badge">
      <div class="score-label">Mejor puntuación</div>
      <div class="score-value">${best}%</div>
    </div>` : '';
}

// =========================
// Nav e Init
// =========================
function setupNav() {
    $all('.nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const sec = btn.dataset.section;
            if (sec === 'quiz') startQuiz(null);
            else showSection(sec);
        });
    });
    // Estado inicial
    $all('.section').forEach(s => s.hidden = true);
    document.getElementById('home').hidden = false;

    // Exponer helpers globales usados inline
    window.showSection = showSection;
}

document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupLibraryControls();
    setupCharactersControls();
    renderHomeScore();
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});