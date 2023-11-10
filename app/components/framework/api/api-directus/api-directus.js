/* eslint-disable */
import $ from "jquery";

export class ApiDirectus {
  _get(method, filters) {
    const _def = new $.Deferred();

    $.get(`api/1.1/tables/${method}/rows`, this.getFilters(filters))
      .then(function(data) {
        return data.data;
      })
      .fail(function() {
        _def.reject();
      })
      .done(function(data) {
        _def.resolve(data);
      });

    return _def.promise();
  }

  getFilters(filters) {
    const list = {};
    for (const p in filters) {
      // list.push( "filters[${p}][eq]=${filters[p]}" );
      if (filters.hasOwnProperty(p)) {
        switch (typeof filters[p]) {
          case "object":
            for (const method in filters[p]) {
              if (filters[p].hasOwnProperty(method)) {
                add(p, filters[p][method], method);
              }
            }
            break;
          default:
            add(p, filters[p]);
            break;
        }
      }
    }

    return list;

    function add(column, value, method) {
      if (method) {
        method = `[${method}]`;
      }
      list[`filters[${column}]${method || ""}`] = value;
    }
  }
}
