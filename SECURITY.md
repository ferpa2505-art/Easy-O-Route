# Security Policy

> **Política de Segurança do Easy-O-Route**

## 🔒 Relatando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança no Easy-O-Route, **por favor, não abra um issue público no GitHub**.

Em vez disso, entre em contato diretamente:

- **E-mail**: ferpa2505-art@protonmail.com
- **GitHub**: [@ferpa2505-art](https://github.com/ferpa2505-art) (mensagem direta)

Inclua o máximo de detalhes possível:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Versão afetada
- Impacto potencial

**Nós nos comprometemos a:**
- Responder dentro de 48 horas
- Manter a comunicação privada
- Trabalhar em uma correção o mais rápido possível
- Dar crédito adequado quando a vulnerabilidade for corrigida

## 🛡️ Melhores Práticas de Segurança

### 1. Chaves de API

**⚠️ NUNCA:**
- Compartilhe chaves de API em chats, grupos ou e-mails
- Cole chaves em issues, pull requests ou discussões públicas
- Faça commit de chaves em repositórios Git
- Compartilhe capturas de tela com chaves visíveis

**✅ SEMPRE:**
- Armazene chaves em gerenciadores de senhas (Bitwarden, 1Password, etc.)
- Use variáveis de ambiente para chaves
- Remova chaves comprometidas imediatamente
- Use chaves com permissões mínimas necessárias

### 2. Configuração do OmniRoute

- **Troque a senha padrão** (`CHANGEME`) no primeiro acesso
- **Ative o início automático** para não precisar digitar a senha toda vez
- **Faça backup** da pasta `~/.omniroute` regularmente
- **Mantenha o OmniRoute atualizado**

### 3. Provedores de IA

- **Use apenas chaves de API oficiais** (evite provedores "web" que usam cookies)
- **Verifique os termos de uso** de cada provedor
- **Não envie dados sensíveis** para provedores gratuitos
- **Monitore o uso** e defina limites de gasto

### 4. Easy-O-Route CLI

- **Mantenha o Easy-O-Route atualizado** (`npm update -g easy-o-route`)
- **Verifique a integridade** dos pacotes npm
- **Use o modo de desenvolvimento** apenas em ambientes seguros

## 📋 Vulnerabilidades Conhecidas

Atualmente, não há vulnerabilidades conhecidas.

## 🔄 Processo de Correção

1. **Recebimento**: Recebemos o relatório de vulnerabilidade
2. **Triagem**: Avaliamos o impacto e a severidade
3. **Correção**: Desenvolvemos um patch
4. **Teste**: Testamos a correção extensivamente
5. **Release**: Publicamos uma nova versão com a correção
6. **Divulgação**: Notificamos o reportador e, se necessário, a comunidade

## 📜 Políticas

- **Tempo de resposta**: 48 horas para o primeiro contato
- **Tempo de correção**: Dependendo da severidade (de horas a dias)
- **Divulgação pública**: 30 dias após a correção (ou quando a maioria dos usuários atualizar)

## 🎯 Escopo

Esta política se aplica a:
- Easy-O-Route CLI
- Scripts Bash do Easy-O-Route
- Documentação do Easy-O-Route
- Repositório GitHub do Easy-O-Route

## 📞 Contato

Para questões de segurança, use os canais mencionados acima.

Para outras questões, sinta-se à vontade para:
- Abrir um issue no GitHub
- Participar das discussões
- Contribuir com pull requests

---

**Agradecemos por ajudar a manter o Easy-O-Route seguro!**

*Última atualização: 2026-01-01*
