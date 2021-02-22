======================================================================(12/2)
-destrinxei arquivos originais
-transformei a csv q eu tinha coletado pra o formato q a função aceita
    -demorou bastante pq tive q fica fazeno engenharia reversa no codigo mal documentado
        []documentar melhor

-deixei o label no lugar
    []mudar label pro nome do twitter(pegar pela api)
=======================================================================(14/2)
-pesquisei sobre mongo db
-criei conta e collection no mongo
-consegui adicionar item num bd em py
-criei um trigger
-criei trigger pra coletar info da api do twitter
-reformulei scraper
-coletei informação retrograda
-formatei e inseri informação no db
=======================================================================(15/2)
-criei o server em express
-substitui os atributos date que eram string no banco da dados por objetos Date()
-criei api pra fazer a query no banco de dados
    []criar cache
-codifiquei o resultado da api em uma csv no client
    -fiz mais pra testar se ia dar certo e pq queria ver o negocio funcionando
    -pode servir pra criar botãozinho pra baixar dados
-botei o client pra rodar o grafico
-o que eu faria diferente:
    - importar o ID da conta do twitter também pro banco de dados
        e criar o 'index' baseado no id e não no nickname
=======================================================================(16/2)
-assisti video indtrodutorio a d3
    -https://www.youtube.com/watch?v=rQroxWLZiCo
    -Shirley Wu
-li e interpretei o codigo do gerador do grafico
-identifiquei o problema
-energia desligou e o ip white listed do banco de dados mudou
-fiz uma função que faz uma interpolação dos dados com intervalo de tempo irregular pra intervalos fixos
=======================================================================(17/2)
-coploquei o usuario e senha do mongo em uma variavel no enviroment
-criei o repositorio
-upei no heroku
-adicionei morgan pros logs e helmet pra segurança
    -removi helmet
    []helmet tem q ser configurado melhor pa conseguir pegar as biblo por cdn

=======================================================================(19/2)
-criei uma conta no google analytics e adicionei a tag ao site
-tirei a gambiarra dos csv e papaparse
    []trocar nomes time e row_data
-dei uma geralzinha no codigo, resolvi varios bug q surgiram
    []arrumar o top_n
    [x]resolver bug do undefined
========================================================================(20/2)
-resolvi bug do undefined
    -o length do loop tava 'data' e n normalized data
-resolvi problema do .exit n remover
    -.attr('y', d => y(top_n + 1) + barPadding / 2)
    -.attr('y', () =>{ y(top_n + 1) + barPadding / 2})
    -colocar {} na sintaxe resolveu, n sei pq
    -na vdd n resolveu
    -diminuir 50ms na transição antes do remove resolveu
    -.duration(tickDuration-50)
[x]ver pq na função dos keyframes ele n cria até o ultimo
    - >= no for loop

========================================================================(22/2)
-adicionei botao de reiniciar
-coloquei data em pt-br
-fixei aspect ratio

=======================================================================
[x]decidir se dexo 1 info por dia ou em outro intervalo
    -2h
[x]mudar o formato do scraper
[x]mudar formato do query
    -csv:   data,       nome,nome,nome \n
            2020-03-01, 1555,4666,9999 \n

    -bd:{data:Data(), 
        [@user:{    
            nome:'fulanin',
            followers:666}
        ]
    }
[x]recoletar os dados
[]ter ctz q os q n axei os q n tem twitter
[x]servir
    flask?
    x - express    
[x]configurar função do d3 pra aceitar os dados em json
[x]resolver problema da frequencia de samples
    -gerar samples artificiais
    -keyframes
        -descobrir como funciona isso no d3

[x]criar .env
[x]upar em um server
[x]fixar aspect ratio


-extras:
    []labels customizados
        -nome do twitter
        -href
    []cores diferentes pra shepa, vip e kikado
    []embbed,gif,video,etc
    []colocar infos
        -ultima data checada por ex
        -minhas infos 
    []deixar uma animação dele subindo devagarinho falsa quanto terminar a a nimaçao
    [x]tirar os com value 0 do grafico
    []colocar um mostradorzinho com a data q vai movendo pela timeline
    