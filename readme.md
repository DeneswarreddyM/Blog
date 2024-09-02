mongodb
username:mdeneswar47
password:b2zIDtZlq1wAIymf

Extra:mongodb+srv://mdeneswar47:b2zIDtZlq1wAIymf@cluster0.kan5kgi.mongodb.net/blog


    
    <% data.forEach(post=> { %>
      <li>
        <a href="#">
          <span><%=post.title%> </span>
          <span class="article-list_date"><%= post.createdAt.toDateString() %></span> 
        </a>
      </li>
      <% }) %>
  </ul>
  
   <% if (nextPage!==null) { %>
    <a href="/?page=<%= nextPage %>" class="pagination">&lt; View Older Posts</a>
   <% } %>

