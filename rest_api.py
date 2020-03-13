from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import json
import sqlite3
import response_codes


def IsInt(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def connect_to_database():
    c = conn.cursor()
    # Create table
    c.execute('''CREATE TABLE IF NOT EXISTS heroes
                 (id integer PRIMARY KEY AUTOINCREMENT, name string, health int)''')
    conn.commit()
    return conn


def exists(name_or_id):
    c = conn.cursor()
    if str(type(name_or_id)) == "<class 'int'>":
        c.execute(f'SELECT * FROM heroes WHERE id = ?', (name_or_id,))
    else:
        c.execute(f'SELECT * FROM heroes WHERE name = ?', (name_or_id,))
    query = c.fetchall()
    if len(query) > 0:
        return True
    else:
        return False


def insert_hero(name, health):
    c = conn.cursor()
    c.execute(f"INSERT INTO heroes (name, health) VALUES (?,?)", (name, health))
    conn.commit()
    return True


def update_hero(id, name, health):
    c = conn.cursor()
    if name != '' and health != '':
        c.execute(f"UPDATE heroes SET name = ?, health = ? WHERE id = ?", (name, health, id))
    elif name == '' and health != '':
        c.execute(f"UPDATE heroes SET health = ? WHERE id = ?", (health, id))
    elif name != '' and health == '':
        c.execute(f"UPDATE heroes SET name = ? WHERE id = ?", (name, id))
    conn.commit()


def get_all_heroes():
    # a Python object (dict):
    print('Creating result for request get_all_heroes:')
    c = conn.cursor()
    c.execute('SELECT * FROM heroes')

    x = dict(heroes=list(map(lambda x: dict(id=x[0], name=x[1], health=x[2]), c.fetchall())))
    y = convert_to_JSON(x)
    return y


def get_hero_by_id(id):
    c = conn.cursor()
    c.execute('SELECT * FROM heroes  WHERE id = ?', (id,))
    hero = c.fetchone()
    if hero:
        x = dict(hero=dict(id=hero[0], name=hero[1], health=hero[2]))
        return convert_to_JSON(x)
    return response_codes.responses[404]


def post_hero(hero):
    print('Creating result for request post_hero: ' + hero)
    hero = convert_from_JSON(hero)
    if 'name' not in hero:
        return response_codes.responses[400]
    if 'health' not in hero:
        return response_codes.responses[400]
    name = hero['name']
    health = hero['health']
    if exists(name):
        return response_codes.responses[409]
    return convert_to_JSON(dict(result=insert_hero(name, health)))


def delete_all_heroes():
    return response_codes.responses[405]


def delete_hero_by_id(id):
    if exists(int(id)):
        c = conn.cursor()
        c.execute(f"DELETE FROM heroes WHERE id = ?", (id,))
        conn.commit()
        return convert_to_JSON(dict(result=True))
    else:
        return response_codes.responses[404]


def update_partial_hero_by_id(id, hero):
    print('Updating put_hero: ' + hero)
    name = ''
    health = ''
    if exists(int(id)):
        hero = convert_from_JSON(hero)
        if 'name' in hero:
            name = hero['name']
        if 'health' in hero:
            health = hero['health']
        try:
            update_hero(int(id), name, health)
        except:
            return response_codes.responses[400]
        return convert_to_JSON(dict(result=True))
    else:
        return response_codes.responses[404]


def update_hero_by_id(id, hero):
    print('Updating put_hero: ' + hero)

    if exists(int(id)):
        hero = convert_from_JSON(hero)
        if 'name' not in hero:
            return response_codes.responses[400]
        if 'health' not in hero:
            return response_codes.responses[400]
        try:
            update_hero(int(id), hero['name'], hero['health'])
        except:
            return response_codes.responses[400]
        return convert_to_JSON(dict(result=True))
    else:
        return response_codes.responses[404]


def close_database_connection():
    conn.close()


def convert_to_JSON(to_be_converted):
    return json.dumps(to_be_converted)


def convert_from_JSON(to_be_converted):
    return json.loads(to_be_converted)


class GetHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        data = self.HandleGet(self.path)
        if data == response_codes.responses[404] or data == response_codes.responses[400]:
            self.HandleErrorMessage(data)
            return
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()
        self.wfile.write(bytes(data))
        return

    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        data = self.HandlePost(self.path, self.data_string.decode("utf-8"))
        if data == response_codes.responses[404] or data == response_codes.responses[400] or data == \
                response_codes.responses[409]:
            self.HandleErrorMessage(data)
            return
        self.send_response(201)
        self.send_header('Content-type', 'text/json')
        self.end_headers()
        self.wfile.write(bytes(data))
        return

    def do_DELETE(self):
        data = self.HandleDelete(self.path)
        if data == response_codes.responses[404] or data == response_codes.responses[400] or data == \
                response_codes.responses[409] or data == response_codes.responses[405]:
            self.HandleErrorMessage(data)
            return
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()
        self.wfile.write(bytes(data))
        return

    def do_PUT(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        data = self.HandlePut(self.path, self.data_string.decode("utf-8"))
        if data == response_codes.responses[404] or data == response_codes.responses[400] or data == \
                response_codes.responses[409] or data == response_codes.responses[405]:
            self.HandleErrorMessage(data)
            return
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()
        self.wfile.write(bytes(data))
        return


    def do_PATCH(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        data = self.HandlePatch(self.path, self.data_string.decode("utf-8"))
        if data == response_codes.responses[404] or data == response_codes.responses[400] or data == \
                response_codes.responses[409] or data == response_codes.responses[405]:
            self.HandleErrorMessage(data)
            return
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()
        self.wfile.write(bytes(data))
        return

    def HandleGet(self, path):
        if path == '/heroes':
            return bytes(get_all_heroes(), encoding="ascii")
        if '/heroes/' in path:
            id = path.split('/')[2]
            if id == '' or IsInt(id) == False:
                return response_codes.responses[400]
            hero = get_hero_by_id(int(id))
            if hero == response_codes.responses[404]:
                return response_codes.responses[404]
            return bytes(hero, encoding="ascii")
        return response_codes.responses[400]

    def HandlePost(self, path, hero):
        if path == '/heroes':
            response = post_hero(hero)
            if response == response_codes.responses[409]:
                return response_codes.responses[409]
            return bytes(response, encoding="ascii")
        return response_codes.responses[400]

    def HandleDelete(self, path):
        if path == '/heroes':
            return response_codes.responses[405]
        if '/heroes/' in path:
            id = path.split('/')[2]
            if id == '' or IsInt(id) == False:
                return response_codes.responses[400]
            hero = delete_hero_by_id(int(id))
            if hero == response_codes.responses[404]:
                return response_codes.responses[404]
            return bytes(hero, encoding="ascii")
        return response_codes.responses[400]

    def HandlePut(self, path, hero):
        if path == '/heroes':
            return response_codes.responses[405]
        if '/heroes/' in path:
            id = path.split('/')[2]
            if id == '' or IsInt(id) == False:
                return response_codes.responses[400]
            response = update_hero_by_id(int(id), hero)
            if response == response_codes.responses[404]:
                return response_codes.responses[404]
            if response == response_codes.responses[409]:
                return response_codes.responses[409]
            if response == response_codes.responses[400]:
                return response_codes.responses[400]
            return bytes(response, encoding="ascii")
        return response_codes.responses[400]

    def HandlePatch(self, path, hero):
        if path == '/heroes':
            return response_codes.responses[405]
        if '/heroes/' in path:
            id = path.split('/')[2]
            if id == '' or IsInt(id) == False:
                return response_codes.responses[400]
            response = update_partial_hero_by_id(int(id), hero)
            if response == response_codes.responses[404]:
                return response_codes.responses[404]
            if response == response_codes.responses[409]:
                return response_codes.responses[409]
            if response == response_codes.responses[400]:
                return response_codes.responses[400]
            return bytes(response, encoding="ascii")
        return response_codes.responses[400]

    def HandleErrorMessage(self, data):
        if data == response_codes.responses[404]:
            data = bytes(convert_to_JSON(dict(detail='Not found for ' + self.path)), encoding="ascii")
            self.send_response(404)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            self.wfile.write(bytes(data))
            return

        if data == response_codes.responses[409]:
            data = bytes(convert_to_JSON(dict(detail='Conflict for ' + self.path + '. This hero already exists.')),
                         encoding="ascii")
            self.send_response(409)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            self.wfile.write(bytes(data))

        if data == response_codes.responses[405]:
            data = bytes(convert_to_JSON(dict(detail='Method Not Allowed for ' + self.path)), encoding="ascii")
            self.send_response(405)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            self.wfile.write(bytes(data))
            return

        if data == response_codes.responses[400] or not data:
            data = bytes(convert_to_JSON(dict(detail='Bad Request for ' + self.path)), encoding="ascii")
            self.send_response(400)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            self.wfile.write(bytes(data))
            return




conn = sqlite3.connect('.\heroes.db')
connect_to_database()
Handler = GetHandler

httpd = HTTPServer(("localhost", 8086), Handler)
httpd.serve_forever()
close_database_connection()
